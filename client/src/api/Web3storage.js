import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
const globals = require("../global.json");
// logoFile and textFile will need to be reachable. Example below
// export function uploadFiles(e) {
//   e.preventDefault();
//   const files = [
//     new File([logoFile], logoFile.name),
//     new File([textFile], textFile.name)
//   ]
//   var cid = storeFiles(files);
// }
const client = new Web3Storage({ token: globals.web3storage });

export async function storeFiles(files) {
  const cid = await client.put(files);
  console.log("stored files with cid:", cid);
  return cid;
}
export async function retrieve(cid) {
  const res = await client.get(cid);
  console.log(`Got a response! [${res.status}] ${res.statusText}`);
  if (!res.ok) {
    throw new Error(`failed to get ${cid}`);
  }
  const files = await res.files();
  return files;
}
//read File() as image
// Parameter: File() obj
export async function displayImage(file) {
  const reader = new FileReader();
  reader.onload = async function () {
    var dataURL = await reader.result;
    //await setImage(dataURL)       SET STATE
  };
  reader.readAsDataURL(file);
}

export async function status(cid) {
  const res = await client.status(cid);
  return res;
}

// HTML/JS EXAMPLE FOR FILE UPLOAD
/*
const [textFile, setTextFile] = useState(null);
const [logoFile, setLogoFile] = useState(null);
<div>
      <form onSubmit={submitFiles}>
        <label htmlFor="logo-file">Choose logo file</label>
        <input type="file" id="logo-file" name="logo-file" onChange={(e) => setLogoFile(e.target.files[0])} />
        <label htmlFor="text-file">Choose text file</label>
        <input type="file" id="text-file" name="text-file" onChange={(e) => setTextFile(e.target.files[0])} />
        <button type="submit">Submit</button>
      </form>
      <button onClick={retrieve}>Retrieve</button>
      <img src={image} id="testimg" alt="This is an image"></img>
  </div>
*/
