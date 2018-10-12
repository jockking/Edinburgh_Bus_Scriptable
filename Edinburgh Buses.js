// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: bus;
/************
* Scriptable code to get status update for Edinburgh Buses
*
* Although TFL generally require auth, they appear
* to allow use of the Status request without it.
*/

// 1. Configure and format private API key

// Retrieve private key from keychain (note - this needs to be stored in keychain using key 'busapi')
// e.g. let key = Keychain.set('busapi','ABCDEFG')

const secret = Keychain.get('busapi')

//Create date string per API spec
let date = new Date()
formatted_date = getTodaysData()

//Import MD5 Javascript - stored in iCloud Scriptable folder
let fm = FileManager.iCloud()
let dir = fm.documentsDirectory()
let md5lib = '/imports/md5.js'
let filePath = fm.joinPath(dir, md5lib)
let md5src = fm.readString(filePath)
eval(md5src)

//Create API code and hash using MD5
let APICode = secret + formatted_date
let MD5_KEY = md5(APICode)

//Update stopId to your favourite bus stop.
let stopId = 36232574

//Create JSON request to Edinburgh Buses API
const url = "http://ws.mybustracker.co.uk/?module=json&key=" + MD5_KEY + "&function=getBusTimes&stopId1=" + stopId
let req = new Request(url)
let bus_results = await req.loadJSON()

// 2. Create a UITable to present the data.
let table = new UITable()                  

// 3. For each bus  ..
for (bus of bus_results.busTimes) {

  // ... create a new row ...
  let row = new UITableRow()
  
  // ... get the line name and statuses ...
  let busNumber = bus.mnemoService
  let busDestination = bus.nameService
  let nextbus

  // ... iterate through json bus times and extract the first bus time for each bus ...
  for (busTime of bus.timeDatas)
  {
    nextbus = bus.timeDatas[0].minutes
  }

  // ... add row data for each bus ...
  let busNoCell = row.addText(busNumber)
  let destinationCell = row.addText(busDestination)
  let timeCell = row.addText(nextbus.toString())
  
  // ... format columns and rows ...
  row.cellSpacing = 10

  busNoCell.widthWeight = 15
  destinationCell.widthWeight = 70
  timeCell.widthWeight = 15
  
  // ... add row to table ...
  table.addRow(row)
}

// ... and present table ...
QuickLook.present(table)


// ** Function to format todays data in format YYYYMDH
// ** data values require to be double digit so extra logic included
function getTodaysData()
{
  todays_date =  (date.getFullYear().toString()
                    +((date.getMonth() +1) <10?'0':'') + (date.getMonth() + 1).toString()
                    +(date.getDate()<10?'0':'') + date.getDate().toString()
                    +(date.getHours()<10?'0':'')+ date.getHours())

  return todays_date
}