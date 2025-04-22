// app/api/data/route.js
import data from '../../json.json'; // غيّر المسار حسب مكان الملف

export async function GET() {
  return Response.json(data);
}
