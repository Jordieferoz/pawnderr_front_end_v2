const Hero = () => {
  return (
    <section className="relative min-h-screen bg-primary-theme/8">
      <div className="mx-auto container">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              PAWnderr
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl max-w-2xl mx-auto">
            Connect with fellow pet lovers, share adorable moments, and find
            your perfect furry companion.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
