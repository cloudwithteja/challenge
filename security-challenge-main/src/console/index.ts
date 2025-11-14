import { AuthenticationController } from '../controllers/authentication';
import { FileUserData } from '../data/file/user';

async function userData() {
  return new FileUserData();
}

const runCreateUser = async (username: string, password: string) => {
  const auth = new AuthenticationController(await userData());
  await auth.createUser(username, password);
};

const runAuthenticateUser = async (username: string, password: string) => {
  const auth = new AuthenticationController(await userData());
  const isValid = await auth.isPasswordValid(username, password);

  console.log('The credentials are: ', isValid ? 'valid' : 'invalid');
};

console.log('Script running with arguments: ');

process.argv.forEach(function (val, index) {
  console.log(index + ': ' + val);
});

if (process.argv.length < 3) {
  console.error('Please provide arguments');
  process.exit(1);
}

if (process.argv[2] === 'create') {
  const [
    _node,
    _script,
    _command,
    username,
    password,
  ] = process.argv;
  runCreateUser(username, password);
}

if (process.argv[2] === 'verify') {
  const [
    _node,
    _script,
    _command,
    username,
    password,
  ] = process.argv;
  runAuthenticateUser(username, password);
}

console.log('Complete');
