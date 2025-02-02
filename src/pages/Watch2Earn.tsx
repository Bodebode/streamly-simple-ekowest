import { PlayCircle, Trophy, PiggyBank, Coins, DollarSign, Home, Timer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

export const Watch2Earn = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-koya-background to-black text-koya-text pt-20">
        <div className="container mx-auto px-4 space-y-16">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Watch2Earn Dashboard</h1>
            <Button variant="outline" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <div className="p-6 space-y-4">
                <Trophy className="w-12 h-12 text-yellow-500" />
                <h3 className="text-xl font-bold">Your Points</h3>
                <p className="text-3xl font-bold text-yellow-500">0</p>
              </div>
            </Card>

            <Card>
              <div className="p-6 space-y-4">
                <Timer className="w-12 h-12 text-blue-500" />
                <h3 className="text-xl font-bold">Watch Time</h3>
                <p className="text-3xl font-bold text-blue-500">0 min</p>
              </div>
            </Card>

            <Card>
              <div className="p-6 space-y-4">
                <DollarSign className="w-12 h-12 text-green-500" />
                <h3 className="text-xl font-bold">Earnings</h3>
                <p className="text-3xl font-bold text-green-500">₦0</p>
              </div>
            </Card>
          </div>

          <div className="bg-koya-card p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">How to Earn</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <PlayCircle className="text-koya-accent" />
                <span>Watch movies to earn points</span>
              </li>
              <li className="flex items-center gap-3">
                <Trophy className="text-koya-accent" />
                <span>Complete movies for bonus points</span>
              </li>
              <li className="flex items-center gap-3">
                <PiggyBank className="text-koya-accent" />
                <span>Convert points to real money</span>
              </li>
            </ul>
          </div>

          {/* Marketing Content for Logged In Users */}
          <div className="pt-16 border-t border-gray-800">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold text-koya-accent">
                How Watch2Earn Works
              </h2>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                Get rewarded for watching your favorite Nollywood content!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 py-12">
              <div className="bg-koya-card p-6 rounded-lg space-y-4">
                <PlayCircle className="w-12 h-12 text-koya-accent" />
                <h3 className="text-xl font-bold">Watch Movies</h3>
                <p>Stream your favorite Nollywood content like you always do. Every minute counts towards your earnings.</p>
              </div>
              <div className="bg-koya-card p-6 rounded-lg space-y-4">
                <Trophy className="w-12 h-12 text-koya-accent" />
                <h3 className="text-xl font-bold">Earn Points</h3>
                <p>Accumulate Ekowest coins based on your watch time. Bonus points for completing movies and sharing reviews!</p>
              </div>
              <div className="bg-koya-card p-6 rounded-lg space-y-4">
                <PiggyBank className="w-12 h-12 text-koya-accent" />
                <h3 className="text-xl font-bold">Get Paid</h3>
                <p>Convert your coins to real money - Naira, Dollars, or Pounds. Withdraw straight to your bank account!</p>
              </div>
            </div>

            <div className="bg-koya-card p-8 rounded-lg mt-8">
              <h2 className="text-3xl font-bold mb-6">Earning Potential</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Coins className="text-koya-accent" />
                  <p>Earn 10 coins per minute of watch time</p>
                </div>
                <div className="flex items-center gap-4">
                  <DollarSign className="text-koya-accent" />
                  <p>1000 coins = ₦500 / $0.50 / £0.40</p>
                </div>
                <div className="border-t border-gray-700 pt-4 mt-6">
                  <p className="text-lg">Watch just 2 hours daily to earn up to ₦15,000 monthly!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-koya-background to-black text-koya-text">
      <div className="container mx-auto px-4 py-16 space-y-16">
        <div className="flex justify-end pt-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="text-center space-y-6 pt-12">
          <h1 className="text-4xl md:text-6xl font-bold text-koya-accent">
            Watch2Earn with Ekowest TV
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Yes, you read that right! Get paid to watch your favorite Nollywood movies.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 py-12">
          <div className="bg-koya-card p-6 rounded-lg space-y-4">
            <PlayCircle className="w-12 h-12 text-koya-accent" />
            <h3 className="text-xl font-bold">Watch Movies</h3>
            <p>Stream your favorite Nollywood content like you always do. Every minute counts towards your earnings.</p>
          </div>
          <div className="bg-koya-card p-6 rounded-lg space-y-4">
            <Trophy className="w-12 h-12 text-koya-accent" />
            <h3 className="text-xl font-bold">Earn Points</h3>
            <p>Accumulate Ekowest coins based on your watch time. Bonus points for completing movies and sharing reviews!</p>
          </div>
          <div className="bg-koya-card p-6 rounded-lg space-y-4">
            <PiggyBank className="w-12 h-12 text-koya-accent" />
            <h3 className="text-xl font-bold">Get Paid</h3>
            <p>Convert your coins to real money - Naira, Dollars, or Pounds. Withdraw straight to your bank account!</p>
          </div>
        </div>

        <div className="bg-koya-card p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6">Earning Potential</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Coins className="text-koya-accent" />
              <p>Earn 10 coins per minute of watch time</p>
            </div>
            <div className="flex items-center gap-4">
              <DollarSign className="text-koya-accent" />
              <p>1000 coins = ₦500 / $0.50 / £0.40</p>
            </div>
            <div className="border-t border-gray-700 pt-4 mt-6">
              <p className="text-lg">Watch just 2 hours daily to earn up to ₦15,000 monthly!</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-6 py-12">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Earning?</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Join thousands of smart viewers who are already earning while enjoying their favorite Nollywood content.
          </p>
          <Button size="lg" className="bg-koya-accent hover:bg-koya-accent/90">
            <Link to="/login">Sign Up Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Watch2Earn;