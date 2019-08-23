import { PORT, MONGODB_URI } from 'src/configuration';
import { connect } from 'src/db';
import { getApp } from 'src/app';

const startServer = async () => {
  try {
    await connect(MONGODB_URI);

    const app = getApp();

    app.listen(PORT, () => {
      console.log(`server started at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
