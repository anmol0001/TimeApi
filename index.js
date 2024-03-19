const http = require('http');

http.createServer(async (req, res) => {
  if (req.url === '/getTimeStories') {
    try {
      const timeUrl = 'https://time.com'

      const response = await fetch(timeUrl);
      if (!response.ok) {
       res.writeHead(400, { 'Content-Type': 'application/json' });
       res.end("Failed to fetch response from api")  
      }
      
      const finalHtmlData = await response.text();
      const latestStories = extractLatestStories(finalHtmlData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(latestStories));
    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end('Failed to fetch latest stories' );
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('Hi From Time API, Please Go To /getTimeStories for latest stories');
  }
}).listen(8000, () => {
  console.log('Server Running at port 8000');
});


const extractLatestStories = (finalHtmlData) => {
  try {
  const splitData = finalHtmlData?.toString()?.split('<li class="latest-stories__item">')
  const length = splitData.length < 6 ? splitData.length : 6
  let latestStories = []

  for(let i=1;i<=length;i++){
    
    const linkStartIndex = splitData[i].indexOf('href="') + 'href="'.length;
    const linkEndIndex = splitData[i].indexOf('"', linkStartIndex);
    const link = "https://time.com" + splitData[i].slice(linkStartIndex, linkEndIndex);

    const titleStartIndex = splitData[i].indexOf('<h3 class="latest-stories__item-headline">') + '<h3 class="latest-stories__item-headline">'.length;
    const titleEndIndex = splitData[i].indexOf('</h3>', titleStartIndex);
    const title = splitData[i].slice(titleStartIndex, titleEndIndex);
    
    latestStories.push({title,link})
   
  }
  
  console.log(latestStories)
  return latestStories
  } catch (error) {
    console.log(error)
  }
  
}
