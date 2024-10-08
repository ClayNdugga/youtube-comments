import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";

const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col justify-center items-center text-center w-full">
        {/* Limit the width of the main content */}
        <div className="max-w-2xl w-full mx-auto px-4">
          <h1 className="text-7xl font-bold mb-4">
            Search for YouTube Comments
          </h1>
          <p className="mb-6 text-gray-600">
            Enter a YouTube video URL to find comments
          </p>

          {/* Search Bar */}
          <div className="relative flex items-center">
            <Input
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none" // padding-left for the icon space
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;
