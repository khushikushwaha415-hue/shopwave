const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center bg-indigo-600">
              <span className="text-white font-semibold text-[10px]">S</span>
            </div>
            <span className="text-sm font-medium text-gray-900">ShopWave</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-900">About</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
          </div>

          <p className="text-xs text-gray-400">© 2026 ShopWave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;