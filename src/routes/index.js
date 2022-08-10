import clientPromise from '$lib/mongodb-client';

// export async function POST(request) {
//   try {
//     const dbConnection = await clientPromise;
//     const db = dbConnection.db();
//     const collection = db.collection('plots');
//     const plot = JSON.parse(request.body);
//     const newPlot = await collection.insertOne(plot);
//     return {
//       status: 200,
//       body: {
//         newPlot,
//       },
//     };
//   } catch (err) {
//     console.error(err);
//   }
// }

export async function GET(request) {
  try {
    const dbConnection = await clientPromise;
    const db = dbConnection.db('t-adventure');
    const collection = db.collection('plots');
    const plots = await collection.findOne({ id: 1 });
    return {
      status: 200,
      body: {
        plots,
      },
    };
  } catch (err) {
    console.error(err);
  }
}
GET().then((data) => console.log(data));
