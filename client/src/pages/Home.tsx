const Home = () => {
  return (
    <section className="min-h-[80vh] bg-gray-50 flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
          Welcome to VaultDesk
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto mb-6">
          A secure and user-friendly collaboration platform for professionals who value privacy, transparency, and trust.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/register"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="border border-blue-700 text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            Sign In
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
