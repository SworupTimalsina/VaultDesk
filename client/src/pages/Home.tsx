const Home = () => {
  return (
    <section className="min-h-[80vh] bg-gray-50 flex items-center justify-center text-center px-4">
      <div className="p-8 min-w-[340px] sm:min-w-[400px] border rounded-xl shadow-lg text-[#5E5E5E]">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
          Welcome to VaultDesk
        </h1>
        <p className="text-sm sm:text-base max-w-xl mx-auto mb-6">
          A secure and user-friendly collaboration platform for professionals who value privacy, transparency, and trust.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/register"
            className="bg-primary text-white px-6 py-2 rounded-md text-base hover:bg-blue-800 transition"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="border border-primary text-primary px-6 py-2 rounded-md text-base hover:bg-blue-50 transition"
          >
            Sign In
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
