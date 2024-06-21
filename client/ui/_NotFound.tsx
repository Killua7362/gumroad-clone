import '@/ui/styles/404.css';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';

const NotFoundPage = () => {
  const [pupilPos, setPupilPos] = useState<pupilPos>({
    left: '0',
    top: '0',
  });

  const [mouthHeight, setMouthHeight] = useState<string>('1.5');

  return (
    <div
      className="flex flex-col gap-y-10 fixed sm:ml-24 sm:pr-24 mt-[2rem] sm:mt-0 z-50 top-0 left-0 w-full h-full text-white items-center justify-center tracking-wider font-thin"
      onMouseMove={(e) => {
        const boundingRect = e.currentTarget.getBoundingClientRect();

        const width_high = boundingRect.right;
        const width_low = boundingRect.left;

        const height_high = boundingRect.bottom;
        const height_low = boundingRect.top;

        const normalized_width =
          (e.clientX - width_low) / (width_high - width_low);
        const percentage_width = Math.min(
          100,
          Math.max(0, normalized_width * 100)
        );

        const normalized_height =
          (e.clientY - height_low) / (height_high - height_low);
        const percentage_height = Math.min(
          100,
          Math.max(0, normalized_height * 100)
        );

        setPupilPos({
          left: (0.9 * (percentage_width / 100)).toString(),
          top: (1.9 * (percentage_height / 100)).toString(),
        });

        setMouthHeight(
          (1 * ((100 - percentage_height) / 100) + 1.5).toString()
        );
      }}>
      <div className="flex">
        <div className="eye-main font-thinner">
          <div className="eye">
            <div className="inner-eye">
              <div
                className="pupil"
                style={{
                  top: `${pupilPos.top}rem`,
                  marginLeft: `${pupilPos.left}rem`,
                }}></div>
            </div>
          </div>
          <div className="eye">
            <div className="inner-eye">
              <div
                className="pupil"
                style={{
                  top: `${pupilPos.top}rem`,
                  marginLeft: `${pupilPos.left}rem`,
                }}></div>
            </div>
          </div>
          <div className={`teeth`} style={{ height: `${mouthHeight}rem` }} />
        </div>
      </div>
      <div className="text-3xl uppercase font-thin tracking-wider">
        Page Not Found
      </div>
      <div className="w-[10rem] border-b-[1px] border-white/80" />
      <Link to="/home" className="no-underline">
        <div className="text-lg tracking-wide font-normal text-white/80">
          Go Home?
        </div>
      </Link>
    </div>
  );
};
export default NotFoundPage;
