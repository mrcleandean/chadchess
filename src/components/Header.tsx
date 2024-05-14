import { logo } from '../assets';

const Header = () => {
    return (
        <div className="relative z-10 h-10 w-full bg-primary flex items-center justify-left border-b-[0.5px] border-secondary">
            <div className='ml-3 flex items-center'>
                <img
                    alt="chess logo"
                    src={logo}
                    className='w-7 h-7 ml-[5px] object-contain origin-center -rotate-12 drop-shadow-[0.35px_0.35px_2px_black]'
                />
                <h1 className="text-secondary -ml-1 drop-shadow-[0.5px_0.5px_1px_black] font-bold text-md tracking-wide uppercase">CHESS CHAD</h1>
            </div>
        </div>
    )
}

export default Header