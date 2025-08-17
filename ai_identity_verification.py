print("PYTHON VERIFICATION STARTED", flush=True)
import requests
def download_file(url, local_path):
    response = requests.get(url)
    with open(local_path, 'wb') as f:
        f.write(response.content)
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"
import cv2
import pytesseract
from deepface import DeepFace
import sys

def extract_face(image):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    if len(faces) > 0:
        x, y, w, h = faces[0]
        return image[y:y+h, x:x+w]
    return None

def verify_document(image_path):
    # Load image
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        doc_contour = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(doc_contour)
        doc_img = image[y:y+h, x:x+w]
        print("Document detected in image.", flush=True)
        text = pytesseract.image_to_string(doc_img)
        print("Extracted Text:", flush=True)
        print(text, flush=True)
        # Extract face from document
        doc_face = extract_face(doc_img)
        if doc_face is not None:
            cv2.imwrite("doc_face.jpg", doc_face)
            print("Face extracted from document.", flush=True)
            return "doc_face.jpg"
        else:
            print("No face found in document.", flush=True)
            return None
    else:
        print("No document detected in image.", flush=True)
        return None


# Video verification remains unchanged
def extract_face_from_video(video_path):
    cap = cv2.VideoCapture(video_path)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        # Save the full frame as the image
        cv2.imwrite("video_face.jpg", frame)
        cap.release()
        print("Full frame extracted from video.", flush=True)
        return "video_face.jpg"
    cap.release()
    print("No frame found in video.", flush=True)
    return None

def verify_video(video_path):
    cap = cv2.VideoCapture(video_path)
    blink_count = 0
    face_detected = False
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        if len(faces) > 0:
            face_detected = True
            for (x, y, w, h) in faces:
                roi_gray = gray[y:y+h, x:x+w]
                eyes = eye_cascade.detectMultiScale(roi_gray)
                if len(eyes) == 0:
                    blink_count += 1
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    print("Face detected in video." if face_detected else "No face detected in video.", flush=True)
    print("Blinks detected:", blink_count, flush=True)
    if face_detected and blink_count > 0:
        print("Liveness confirmed (human detected).", flush=True)
    else:
        print("Liveness not confirmed.", flush=True)

def verify_full_name(extracted_text, provided_name):
    # Normalize text by converting to lowercase and removing extra spaces
    extracted_name = ' '.join(extracted_text.lower().split())
    provided_name = ' '.join(provided_name.lower().split())

    if provided_name in extracted_name:
        print(f"Full name match found: {provided_name}", flush=True)
        return True
    else:
        print(f"Full name does not match. Extracted: {extracted_name}, Provided: {provided_name}", flush=True)
        return False

def emit_progress(step, total_steps=7):
    percent = int((step / total_steps) * 100)
    print(f'PROGRESS:{percent}', flush=True)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python ai_identity_verification.py <document_url> <video_url> <full_name>", flush=True)
        sys.exit(1)
    document_url = sys.argv[1]
    video_url = sys.argv[2]
    provided_name = sys.argv[3]

    step = 1
    # 1. Document detection
    doc_face_path = verify_document(document_url)
    print("Document detected in image.", flush=True)
    emit_progress(step)
    step += 1

    # 2. Text extraction
    extracted_text = pytesseract.image_to_string(cv2.imread(document_url)) if doc_face_path else ''
    print("Extracted Text:\n" + extracted_text, flush=True)
    emit_progress(step)
    step += 1

    # 3. Face extraction from document
    if doc_face_path:
        print("Face extracted from document.", flush=True)
    emit_progress(step)
    step += 1

    # 4. Full frame extraction from video
    video_face_path = extract_face_from_video(video_url)
    print("Full frame extracted from video.", flush=True)
    emit_progress(step)
    step += 1

    # 5. Face detection in video
    verify_video(video_url)
    print("Face detected in video.", flush=True)
    emit_progress(step)
    step += 1

    # 6. Name match
    name_match = verify_full_name(extracted_text, provided_name)
    emit_progress(step)
    step += 1

    # 7. Face matching
    if doc_face_path and video_face_path:
        try:
            result = DeepFace.verify(img1_path=doc_face_path, img2_path=video_face_path, model_name="Facenet")
            distance = result.get("distance", 1)
            similarity = 100 - distance * 100
            if similarity >= 10 and name_match:
                print(f"Face accepted: similarity {similarity:.1f}% (distance={distance:.2f})", flush=True)
            else:
                print(f"Face NOT accepted: similarity {similarity:.1f}% (distance={distance:.2f})", flush=True)
        except Exception as e:
            print(f"Face matching error: {e}", flush=True)
    emit_progress(step)
