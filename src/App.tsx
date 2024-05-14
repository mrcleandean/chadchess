import { Menu, HomeChat, Pieces3D } from './components';
import { useEffect, useState } from 'react';

const Home = () => {
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setChatOpen(true);
    }
  }, []);
  return (
    <div className='w-full flex flex-col md:flex-row'>
      <div className={`${chatOpen ? 'w-full md:w-[50%]' : 'w-full'} flex flex-col items-center`}>
        <Menu chatOpen={chatOpen} setChatOpen={setChatOpen} />
        <Pieces3D />
      </div>
      <div className={`${chatOpen ? 'w-full md:w-[50%]' : 'w-0'}`}>
        <HomeChat chatOpen={chatOpen} setChatOpen={setChatOpen} />
      </div>
    </div>
  )
}

export default Home;