export async function importWeaves() {
  return await (await fetch('./weaves/plainWeave.json')).json();
}
