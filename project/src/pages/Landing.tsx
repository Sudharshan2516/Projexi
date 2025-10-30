import { useNavigate } from 'react-router-dom';
import { Rocket, CheckCircle } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      iconUrl: 'https://cdn.lordicon.com/kthelypq.json',
      title: 'For Entrepreneurs',
      description: 'Showcase your ideas, upload pitch decks, and connect with investors worldwide.',
    },
    {
      iconUrl: 'https://cdn.lordicon.com/fgxwhgdl.json',
      title: 'For Investors',
      description: 'Discover promising startups, review pitches, and build your investment portfolio.',
    },
    {
      iconUrl: 'https://cdn.lordicon.com/dxoycpzg.json',
      title: 'For Dealers',
      description: 'Connect with startups, offer materials and services, and grow your business network.',
    },
    {
      iconUrl: 'https://cdn.lordicon.com/mfslghfy.json',
      title: 'Global Reach',
      description: 'Access a worldwide network of entrepreneurs, investors, and dealers in one platform.',
    },
    {
      iconUrl: 'https://cdn.lordicon.com/mrjuyheh.json',
      title: 'Verified Users',
      description: 'Trust verified profiles with credibility scores and authentic reviews.',
    },
    {
      iconUrl: 'https://cdn.lordicon.com/odavpkmb.json',
      title: 'AI Matching',
      description: 'Smart AI algorithms connect you with the right partners based on your preferences.',
    },
  ];

  const benefits = [
    'Post unlimited ideas and projects',
    'AI-powered matchmaking',
    'Real-time messaging and video calls',
    'Community feed and networking',
    'Events and webinars',
    'Analytics and insights',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">Projexi</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/signin')}
              className="px-6 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Connect Ideas with<br />Capital and Resources
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Projexi is the global platform where entrepreneurs showcase ideas, investors discover opportunities,
            and dealers provide materials. Turn your vision into reality.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Join Projexi Today
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <lottie-player
                  src={index === 0 ? 'https://assets4.lottiefiles.com/packages/lf20_5ngs2ksb.json' : index === 1 ? 'https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json' : index === 2 ? 'https://assets9.lottiefiles.com/packages/lf20_bhw1ul4g.json' : index === 3 ? 'https://assets6.lottiefiles.com/packages/lf20_svy4ivvy.json' : index === 4 ? 'https://assets10.lottiefiles.com/packages/lf20_tu5fbz.json' : 'https://assets10.lottiefiles.com/private_files/lf30_btf7j1mz.json'}
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                  style={{ width: 28, height: 28 }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-6">Everything You Need to Succeed</h3>
              <p className="text-blue-100 text-lg mb-8">
                Projexi provides comprehensive tools and features to help you achieve your business goals,
                whether you're an entrepreneur, investor, or dealer.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle size={24} className="text-blue-300 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h4 className="text-2xl font-bold mb-6">Ready to Get Started?</h4>
              <p className="text-blue-100 mb-6">
                Join thousands of entrepreneurs, investors, and dealers already using Projexi to grow their business.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="w-full px-6 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Create Your Free Account
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h3>
          <p className="text-xl text-gray-600 mb-12">
            Get started in minutes and unlock a world of opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Create Your Profile</h4>
            <p className="text-gray-600">
              Sign up and choose your role: Entrepreneur, Investor, or Dealer. Complete your profile to get started.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Connect with Others</h4>
            <p className="text-gray-600">
              Use AI matching to find the right partners. Message, call, and collaborate in real-time.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Grow Your Business</h4>
            <p className="text-gray-600">
              Secure funding, source materials, and build partnerships that drive your success.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Rocket size={28} />
            <h1 className="text-2xl font-bold">Projexi</h1>
          </div>
          <p className="text-gray-400 mb-6">
            Connecting Entrepreneurs, Investors, and Dealers Worldwide
          </p>
          <p className="text-sm text-gray-500">
            &copy; 2025 Projexi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
