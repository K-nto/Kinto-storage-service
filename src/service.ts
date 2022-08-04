
import { create } from 'ipfs-http-client'

// connect to the default API address http://localhost:5001
const client = create()

// connect to a different API
const client = create({ url: "http://127.0.0.1:5002/api/v0" });

// connect using a URL
const client = create(new URL('http://127.0.0.1:5002'))

// call Core API methods
const { cid } = await client.add('Hello world!')

export function doSomeStuff(
  withThis: string,
  andThat: string,
  andThose: string[]
) {
  //function on one line
  if (!andThose.length) {
    return false;
  }
  console.log(withThis);
  console.log(andThat);
  console.dir(andThose);
  return;
}
// TODO: more examples

console.log('ZWtraSB2ZXJhIGhyw6ZnYW1tYQ== :D');