import mongoose from 'mongoose';

(async () => {
  try {
    
    const mongoUri = 'mongodb://localhost:27017/kulluDussehraDB';
      // console.log(mongoUri,'mongo')
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.error('mongo is connected');
  } catch (err) {
    console.error('mongo is not connected', err);
  }
})();
