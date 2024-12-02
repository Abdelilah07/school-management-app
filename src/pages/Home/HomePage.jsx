import QuickActions from './components/QuickActions';
import GreetingHeader from './components/GreetingHeader';
import ChatlingBot from './components/ChatlingBot';

function HomePage() {
  return (
    <div className="flex justify-center flex-wrap gap-4">
      <GreetingHeader />
      <QuickActions />
      <ChatlingBot chatbotId="9718397947" />
    </div>
  );
}

export default HomePage;
