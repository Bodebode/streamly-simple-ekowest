export const Watch2Earn = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Watch2Earn with Ekowest TV</h1>
        
        <div className="bg-white dark:bg-koya-card rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">How it Works</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-koya-accent rounded-full p-3 text-white">1</div>
              <div>
                <h3 className="font-semibold mb-2">Create an Account</h3>
                <p>Sign up to start earning while watching your favorite content</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-koya-accent rounded-full p-3 text-white">2</div>
              <div>
                <h3 className="font-semibold mb-2">Watch Content</h3>
                <p>Stream movies, series, and shows on our platform</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-koya-accent rounded-full p-3 text-white">3</div>
              <div>
                <h3 className="font-semibold mb-2">Earn Rewards</h3>
                <p>Get points for every minute you watch, redeemable for rewards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch2Earn;