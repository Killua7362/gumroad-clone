import RouteComponent from '@/app/RouteComponent';
import './global.module.css';

import { RecoilRoot } from 'recoil';

const RootPage = () => {
  return (
    <RecoilRoot>
      <RouteComponent />
    </RecoilRoot>
  );
};

export default RootPage;
