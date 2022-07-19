let selectedFile;
// console.log(window.XLSX);
document.getElementById("input").addEventListener("change", (event) => {
  selectedFile = event.target.files[0];
});

document.getElementById("button").addEventListener("click", () => {
  if (selectedFile) {
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      let data = event.target.result;
      let workbook = XLSX.read(data, { type: "binary" });

      workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );
        console.log(rowObject);
        document.getElementById("jsondata").innerHTML = JSON.stringify(
          checkparams(rowObject),
          undefined,
          4
        );
        setTimeout(function(){ 
          handleRequest(checkparams(rowObject));
      }, 3000);
        
        
      });
    };
  }
});

function checkparams(obj) {
  console.log(obj)
  obj.forEach((element) => {
    //    console.log(element.pin===undefined)
    if (element.pin === undefined) element["pin"] = "NA";
    if (element.sparshPpoNo === undefined) element["sparshPpoNo"] = "NA";
    if (element.mobile === undefined) element["mobile"] = "NA";
    if (element.pensionerName === undefined) element["pensionerName"] = "NA";
    if (element.service === undefined) element["service"] = "NA";
    if (element.email === undefined) element["email"] = "NA";
    if (element.state === undefined) element["state"] = "NA";
    if (element.district === undefined) element["district"] = "NA";
    if (element.remarks === undefined) element["remarks"] = "NA";
    if (element.aadhar === undefined) element["aadhar"] = "NA";
    if (element.dlcEndDt === undefined) element["dlcEndDt"] = "NA";
    if(element.dlcEndDt)
    {
      var date = moment(element.dlcEndDt).format('YYYY-MM-DD');
      // const myMomentObject = moment(element.dlcEndD, 'YYYY-MM-DD');
      console.log(date)
      element["dlcEndDt"] = date;
    }
    if (element.postOffice === undefined) element["postOffice"] = "NA";
    if (element.tehsil === undefined) element["tehsil"] = "NA";
    if (element.village === undefined) element["village"] = "NA";
    if(element.ImageName===undefined) element["ImageName"] = "NA";
  });
  return obj;
}
function handleRequest(obj) {
  obj.forEach(element => {
    axios.post("http://demo.armscert.com/api/Pensioner/InsertPensioner", element).then(function (response) {
      console.log(response)
      // do whatever you want if console is 
  }).catch(function (err) {
    console.log(err)
  })
  console.log(element);
  
  });
 
}