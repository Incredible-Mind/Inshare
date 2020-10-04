const File = require('./models/file');
const fs = require('fs');
const connectDB = require('./config/db');
connectDB();

async function fetchData() {
    // 24 Hours
    const pastDate = new Date(Date.now() - 1000 );
    const files = await File.find({ createdAt: { $lt: pastDate } });
    if(files.length) {
        for(const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`Successfully Deleted ${file.filename}`);
            } catch (err) {
                console.log(`Error While Deleting File ${err}`);
            }
        }
        console.log('Task Completed!');
    }
}
fetchData().then(process.exit);