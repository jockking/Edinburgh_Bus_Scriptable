/************
* Scriptable code to get status update for Edinburgh Buses
*/
//Create date string per API spec
const maxEntries = 8 // Display the next 6 departures
const maxChars = 22 // Max characters to display of the Destination (middle column)

const bgColour = new Color("#000000") // Use solid black background
const lineFont = new Font("Menlo",14)
const fgColour = new Color('#ffffff', 1)
const footerFont = new Font("Helvetica",13)


//Update stopId to your favourite bus stop.
let busStop = 36232574

let date = new Date()
formatted_date = getTodaysData()
let items = await loadItems(busStop)
let widget = await createWidget(items)
// Check if the script is running in
// a widget. If not, show a preview of
// the widget to easier debug it.
if (!config.runsInWidget) {
  await widget.presentMedium()
}
// Tell the system to show the widget.
Script.setWidget(widget)
Script.complete()


async function createWidget(items) {

  let w = new ListWidget()
  let num = 0
  
  w.backgroundColor = bgColour
      
  for (item of items.busTimes) {

    let busNumber = item.mnemoService
    let busDestination = item.nameService
    let nextbus

    for (busTime of item.timeDatas)
    {
      nextbus = item.timeDatas[0].minutes
    }

    let theLine = w.addText(busNumber + "\t" + busDestination.trim(maxChars).padEnd(maxChars," ") + "\t" + nextbus)
    theLine.textColor = Color.white()
    theLine.font = lineFont
    
    num = num + 1
    if (num == maxEntries) {
      break
    }
  }

  w.addSpacer(10)

  let theFooter = w.addText("Updated: " + await timehMMSS())
  theFooter.textColor = Color.white()
//   theFooter.textColour = fgColour
  theFooter.font = footerFont
  //theFooter.setTextColor(fgColour)
  
  return w
}

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

async function loadItems(stopId) {

    // 1. Configure and format private API key

    // Retrieve private key from keychain (note - this needs to be stored in keychain using key 'busapi')
    // e.g. let key = Keychain.set('busapi','ABCDEFG')
    const secret = Keychain.get('busapi')

    //Create date string per API spec
    let date = new Date()
    formatted_date = getTodaysData()

    //Import MD5 Javascript - stored in iCloud Scriptable folder
    // let fm = FileManager.iCloud()
    // let dir = fm.documentsDirectory()
    let md5lib = '/imports/md5.js'
    // let filePath = fm.joinPath(dir, md5lib)
    // let md5src = fm.readString(filePath)
    // eval(md5src)
    let md5 = importModule(md5lib)

    //Create API code and hash using MD5
    let APICode = secret + formatted_date
    let MD5_KEY = md5(APICode)

    //Create JSON request to Edinburgh Buses API
    const url = "http://ws.mybustracker.co.uk/?module=json&key=" + MD5_KEY + "&function=getBusTimes&stopId1=" + stopId
    // console.log(url)
    let req = new Request(url)
    let bus_results = await req.loadJSON()
    //console.log(bus_results)
    return bus_results
}

async function timehMMSS() {
  var theDate = new Date() 
  return theDate.getHours() + ":" + ("0"+theDate.getMinutes()).slice(-2) + ":" + ("0"+theDate.getSeconds()).slice(-2)
}
