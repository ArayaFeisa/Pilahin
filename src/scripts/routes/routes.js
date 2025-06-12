import home from '../pages/home/home';
import about from '../pages/about/about';
import scan from '../pages/scan/scan';
import education from '../pages/education/education';
import article from '../pages/article/article';
import videos from '../pages/videos/videos';
import auth from '../pages/auth/auth';

const routes = {
  '/': home,
  '/about': about,
  '/scan' : scan,
  '/education': education,
  '/article' : article,
  '/videos' : videos,
  '/auth' : auth
};

export default routes;
