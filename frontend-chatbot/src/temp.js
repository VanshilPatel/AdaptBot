const responseText = `Here are the closest Apollo Hospitals to you, ordered by distance:

* **Apollo Hospital** (Rating: 3.7) - 546.87 meters away
* **Apollo Hospital** (Rating: 5.0) - 5330.39 meters away
* **Apollo Hospital** (Rating: 4.6) - 14743.74 meters away
* **Apollo Hospital** (Rating: 5.0) - 15992.92 meters away
* **Apollo Hospital** (Rating: 4.9) - 22997.93 meters away`;

const parseHospitals = (text) => {
  const hospitalList = [];
  const regex = /\* \*\*(.*?)\*\* \(Rating: (\d\.\d)\) - ([\d\.]+) meters away/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    hospitalList.push({
      name: match[1],
      rating: parseFloat(match[2]),
      distance: parseFloat(match[3])
    });
  }
  
  return hospitalList;
};

const hospitals = parseHospitals(responseText);
console.log(hospitals);
