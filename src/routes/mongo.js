import clientPromise from '$lib/mongodb-client';

const dbConnection = await clientPromise;
const db = dbConnection.db('t-adventure');
const collection = db.collection('plots');

export async function POST({ request }) {
  try {
    const body = await request.json();
    const newPlot = await collection.insertOne(body);
    return {
      status: 201,
      body: {
        newPlot,
      },
    };
  } catch (err) {
    console.error(err);
  }
}

export async function GET() {
  try {
    const plots = await collection.find().toArray();
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

export async function DELETE({ request }) {
  try {
    const option = await request.json();
    console.log(option);
    const plots = await collection.deleteOne(option);
    if (plots.deleteCount === 1) {
      return {
        status: 201,
        body: plots,
      };
    } else {
      return {
        status: 400,
        body: 'delete not successful',
      };
    }
  } catch (err) {
    console.error(err);
  }
}
