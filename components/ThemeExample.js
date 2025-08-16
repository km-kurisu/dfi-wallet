"use client";

export default function ThemeExample() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Theme System Examples</h2>
      
      <div className="space-y-6">
        {/* Buttons */}
        <section className="card p-4">
          <h3 className="text-xl font-semibold mb-4">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-outline">Outline Button</button>
          </div>
        </section>
        
        {/* Cards */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-4">
              <h4 className="text-lg font-medium mb-2">Standard Card</h4>
              <p>This is a standard card using the card class.</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Glass Card</h4>
              <p>This is a glass effect card with backdrop blur.</p>
            </div>
            <div className="bg-primary p-4 rounded-lg text-white">
              <h4 className="text-lg font-medium mb-2">Primary Background</h4>
              <p>This card has a primary background color.</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg text-white">
              <h4 className="text-lg font-medium mb-2">Secondary Background</h4>
              <p>This card has a secondary background color.</p>
            </div>
          </div>
        </section>
        
        {/* Text Styles */}
        <section className="card p-4">
          <h3 className="text-xl font-semibold mb-4">Text Colors</h3>
          <div className="space-y-2">
            <p className="text-foreground">Default text color (foreground)</p>
            <p className="text-primary">Primary text color</p>
            <p className="text-primary-light">Primary light text color</p>
            <p className="text-primary-dark">Primary dark text color</p>
            <p className="text-secondary">Secondary text color</p>
            <p className="text-secondary-light">Secondary light text color</p>
            <p className="text-secondary-dark">Secondary dark text color</p>
          </div>
        </section>
        
        {/* Form Elements */}
        <section className="card p-4">
          <h3 className="text-xl font-semibold mb-4">Form Elements</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Input Field</label>
              <input 
                type="text"
                placeholder="Enter some text"
                className="w-full p-2 rounded-md"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Textarea</label>
              <textarea
                placeholder="Enter multiple lines of text"
                rows="3"
                className="w-full p-2 rounded-md"
              ></textarea>
            </div>
          </div>
        </section>
        
        {/* Footer Examples */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Footer Styling</h3>
          
          {/* Standard Footer */}
          <div className="card p-4">
            <h4 className="text-lg font-medium mb-2">Standard Footer</h4>
            <div className="glass border-t text-center py-4 text-sm">
              <span className="block">© {new Date().getFullYear()} DFI Wallet. All rights reserved.</span>
              <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
                <a href="#" className="nav-link">Privacy Policy</a>
                <a href="#" className="nav-link">Terms of Service</a>
                <a href="#" className="nav-link">Contact Us</a>
              </div>
            </div>
          </div>
          
          {/* Alternative Footer */}
          <div className="card p-4">
            <h4 className="text-lg font-medium mb-2">Alternative Footer with Primary Background</h4>
            <div className="bg-primary rounded-lg text-center py-4 text-sm text-white">
              <span className="block">© {new Date().getFullYear()} DFI Wallet. All rights reserved.</span>
              <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
                <a href="#" className="text-primary-contrast hover:underline">Privacy Policy</a>
                <a href="#" className="text-primary-contrast hover:underline">Terms of Service</a>
                <a href="#" className="text-primary-contrast hover:underline">Contact Us</a>
              </div>
            </div>
          </div>
          
          {/* Secondary Background Footer */}
          <div className="card p-4">
            <h4 className="text-lg font-medium mb-2">Secondary Background Footer</h4>
            <div className="bg-secondary rounded-lg text-center py-4 text-sm text-white">
              <span className="block">© {new Date().getFullYear()} DFI Wallet. All rights reserved.</span>
              <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
                <a href="#" className="text-secondary-contrast hover:underline">Privacy Policy</a>
                <a href="#" className="text-secondary-contrast hover:underline">Terms of Service</a>
                <a href="#" className="text-secondary-contrast hover:underline">Contact Us</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
