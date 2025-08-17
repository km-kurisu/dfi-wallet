"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaIdCard, FaUser, FaFileUpload, FaArrowLeft, FaCheckCircle, FaVideo, FaSpinner, FaWallet } from 'react-icons/fa';
import { useAuth } from "../../contexts/AuthContext";

export default function Verify() {
  const [status, setStatus] = useState('Not Verified');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verificationStep, setVerificationStep] = useState('document'); // 'document' or 'video' or 'processing'
  const [formData, setFormData] = useState({
    fullName: '',
    document: null,
    video: null
  });
  const { user, updateUserData } = useAuth();

  useEffect(() => {
    // Load verification status from user data
    if (user?.isVerified) {
      setStatus('Verified');
    }
    if (user?.displayName) {
      setFormData(prev => ({ ...prev, fullName: user.displayName }));
    }
  }, [user]);

  useEffect(() => {
    if (verificationStep === 'processing' && progress >= 100) {
      completeVerification();
    }
  }, [progress, verificationStep]);

  const completeVerification = async () => {
    try {
      await updateUserData(user.uid, {
        isVerified: true,
        verifiedAt: new Date().toISOString(),
        verificationDocument: formData.document?.name,
        verificationVideo: formData.video?.name
      });
      setStatus('Verified');
    } catch (error) {
      console.error('Error updating verification status:', error);
      alert('Failed to update verification status');
    } finally {
      setLoading(false);
      setVerificationStep('document');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please sign in to verify your identity');
      return;
    }

    if (verificationStep === 'document') {
      if (!formData.document) {
        alert('Please select a document to upload');
        return;
      }
      setVerificationStep('video');
      return;
    }

    if (verificationStep === 'video') {
      if (!formData.video) {
        alert('Please upload a short verification video');
        return;
      }

      setLoading(true);
      setVerificationStep('processing');
      setProgress(0); // Reset progress

      try {
        // Send files and full name to backend using FormData
        const form = new FormData();
        form.append('document', formData.document);
        form.append('video', formData.video);
        form.append('fullName', formData.fullName);

        // Use fetch with ReadableStream to handle progress updates
        const res = await fetch('/api/verify', {
          method: 'POST',
          body: form
        });

        if (!res.body || !window.ReadableStream) {
          // Fallback: no streaming support
          const result = await res.json();
          if (result.success) {
            await completeVerification();
            alert(`Verification successful! Similarity: ${result.similarity}%`);
          } else {
            setStatus('Not Verified');
            alert(`Verification failed. Similarity: ${result.similarity}%`);
          }
        } else {
          // Streaming progress
          const reader = res.body.getReader();
          let buffer = '';
          let done = false;
          let verificationMarked = false;
          while (!done) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;
            if (value) {
              buffer += new TextDecoder().decode(value);
              let lines = buffer.split('\n');
              buffer = lines.pop(); // last line may be incomplete
              for (const line of lines) {
                if (!line.trim()) continue;
                try {
                  const data = JSON.parse(line);
                  if (typeof data.progress === 'number') {
                    setProgress(data.progress);
                  }
                  if (data.success !== undefined && !verificationMarked) {
                    if (data.success) {
                      await completeVerification();
                      verificationMarked = true;
                      alert(`Verification successful! Similarity: ${data.similarity}%`);
                    } else {
                      setStatus('Not Verified');
                      alert(`Verification failed. Similarity: ${data.similarity}%`);
                    }
                  }
                  if (data.error) {
                    alert('Verification error: ' + (data.details || data.error));
                  }
                } catch (e) {
                  // ignore parse errors
                }
              }
            }
          }
        }
      } catch (error) {
        alert('Verification error: ' + error.message);
      } finally {
        setLoading(false);
        setVerificationStep('document');
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'document' || e.target.name === 'video') {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-[340px] sm:max-w-md bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 p-5 sm:p-6 md:p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <FaIdCard className="text-3xl sm:text-4xl text-fuchsia-600 dark:text-fuchsia-400 mx-auto mb-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Digital Identity Verification</h2>
        </div>
        {!user ? (
          <div className="text-center mb-4">
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-4">Please sign in to verify your identity</p>
            <Link href="/signin" className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2">
              {/* You can add an icon here if needed */}
              Sign In
            </Link>
          </div>
        ) : status === 'Verified' ? (
          <div className="text-center py-6">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FaCheckCircle className="text-4xl text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Verification Successful</h3>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-4">
              Your identity has been verified successfully. You now have full access to all platform features.
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-3 sm:gap-4">

            {/* Progress bar for verification */}
            {verificationStep === 'processing' && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Verifying identity...</span>
                  <span className="text-slate-700 dark:text-slate-300">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="mt-3 text-sm text-center text-slate-600 dark:text-slate-400">
                  <p>We are verifying your identity. This will take about 1 minute.</p>
                  <div className="flex items-center justify-center mt-4">
                    <FaSpinner className="animate-spin mr-2" />
                    <span>Processing verification data...</span>
                  </div>
                </div>
              </div>
            )}

            {verificationStep === 'document' && (
              <>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Step 1: Personal Information</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Upload a government-issued ID document</p>
                </div>

                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 border border-white/20 dark:border-slate-700/50 p-3 rounded-xl bg-white/30 dark:bg-gray-700/50 backdrop-blur-sm text-slate-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div className="bg-white/40 dark:bg-slate-800/40 rounded-xl p-4 mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    ID Document (Passport, Driver's License, etc.)
                  </label>
                  <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <input
                      type="file"
                      name="document"
                      onChange={handleChange}
                      accept="image/*,.pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="text-center">
                      <FaFileUpload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {formData.document ? formData.document.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {verificationStep === 'video' && (
              <>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Step 2: Video Verification</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Record a short video of yourself for verification</p>
                </div>

                <div className="bg-white/40 dark:bg-slate-800/40 rounded-xl p-4 mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Record a brief verification video
                  </label>
                  <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <input
                      type="file"
                      name="video"
                      accept="video/*"
                      capture="user"
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="text-center">
                      <FaVideo className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {formData.video ? formData.video.name : 'Click to record or upload a video'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        Short video (5-10 seconds) of your face
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3 rounded">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-xs text-yellow-700 dark:text-yellow-400">
                        Look directly at the camera, blink naturally, and turn your head slightly from side to side.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {verificationStep !== 'processing' && (
              <button
                type="submit"
                disabled={loading || status === 'Verified'}
                className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verificationStep === 'document' && 'Continue to Video Verification'}
                {verificationStep === 'video' && 'Submit Verification'}
                {loading && <FaSpinner className="animate-spin" />}
              </button>
            )}
          </form>
        )}
        {verificationStep !== 'processing' && (
          <p className="mt-4 text-center flex items-center justify-center gap-2">
            Status:
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              {status === 'Verified' && <FaCheckCircle className="text-green-500" />}
              {status}
            </span>
          </p>
        )}

        {status === 'Verified' && (
          <div className="flex justify-center mt-6">
            <Link
              href="/wallet"
              className="bg-fuchsia-600 text-white px-6 py-3 rounded-lg hover:bg-fuchsia-700 inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <FaWallet className="flex-shrink-0" />
              <span>Go to Wallet</span>
            </Link>
          </div>
        )}

        <Link href="/" className="mt-6 text-indigo-600 dark:text-indigo-400 text-center hover:underline flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
          <FaArrowLeft className="flex-shrink-0" />
          <span>Back to Home</span>
        </Link>
      </div>
    </main>
  );
}
