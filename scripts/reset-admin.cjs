const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const URI = 'mongodb://rapgad18_db_user:vD1yGL0ULsABeS8D@ac-gvexz9b-shard-00-00.3zscysw.mongodb.net:27017,ac-gvexz9b-shard-00-01.3zscysw.mongodb.net:27017,ac-gvexz9b-shard-00-02.3zscysw.mongodb.net:27017/infoway_partnership?ssl=true&authSource=admin&retryWrites=true&w=majority';

async function main() {
  console.log('Connecting to database...');
  await mongoose.connect(URI);
  
  const Admin = mongoose.models.Admin || mongoose.model('Admin', new mongoose.Schema({
    email: String,
    passwordHash: String,
    name: String,
    role: String
  }));

  const email = 'admin@infoway.com';
  const newPassword = 'adminpassword123';
  
  let admin = await Admin.findOne({ email });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  if (!admin) {
    admin = await Admin.create({
      name: 'Infoway Administrator',
      email,
      passwordHash,
      role: 'superadmin'
    });
    console.log(`Created new admin account: ${email}`);
  } else {
    admin.passwordHash = passwordHash;
    await admin.save();
    console.log(`Successfully reset password for: ${email}`);
  }

  console.log('--------------------------------------------------');
  console.log('Admin Email:    ' + email);
  console.log('Admin Password: ' + newPassword);
  console.log('--------------------------------------------------');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
