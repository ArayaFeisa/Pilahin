import home from '../pages/home/home';
import scan from '../pages/scan/scan';
import education from '../pages/education/education';
import recycle from '../pages/recycle/recycle';
import article from '../pages/article/article';
import videos from '../pages/videos/videos';
import auth from '../pages/auth/auth';

const routes = {
  '/': home,
  '/scan' : scan,
  '/education': education,
  '/recycle': recycle,
  '/article' : article,
  '/videos' : videos,
  '/auth' : auth
};

export default routes;
