// Synology Chat for Tuya Doorbell script
// Version 1.0 
// 3.12.2021
// ilovegym66 at github
// Script is for iobroker only, send the picture from the Tuya Doorbell (LSC) to the Synologychat.
// Requirements: Tuya Doorbell from LSC ( Action ), iobroker with install Tuya and Synology Adapter, Synology DSM with installed Chat application.


var send, result;

async function loesche_Bild() {
 unlink('0_userdata.0', '/synology/Doorbell.jpg',(e)=>{ if(e) log(e)
 console.log('bild geloescht')
  })
}
 
async function Bild_holen() {
      request({url: getState('tuya.0.Doorbell0.154').val,encoding: null,}, // select Tuya Doorbell picture object (No. 154) here
          (error, response, body) => {if (!error && body) {writeFile("0_userdata.0", "/synology/Doorbell.jpg", body, error);
          console.log('bild geholt')
       }
     }
     );
    }

 // Be aware that you put youre Synology-Chat-Token and the IP of the Synology here:
var URL_Chat = 'http://IPSYNOLOGY:5000/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming&version=2&token=PUTYOURTOKENHERE&payload={"text":"';

// put youre IP from the iobroker here:
var URL_ioBroker = 'http://IPioBroker:81/0_userdata.0/synology/Doorbell.jpg';

var Nachricht = 'someone ring the bell!';   // Message for the pic 
// replace the tuya.0.Doorbell0.154 object with your Doorbell object!
on({id: 'tuya.0.Doorbell0.154'/*doorbell pic*/, change: "any"}, async function (obj) {

 var value = obj.state.val;

 var oldValue = obj.oldState.val;
 
 await loesche_Bild();
 
 await Bild_holen();
 
   send = [URL_Chat,String(Nachricht) + '", "file_url": "',URL_ioBroker,'"}'].join('');

        try {

       require("request")(send, async function (error, response, result) {

         console.log(result);
            await loesche_Bild();
       }).on("error", function (e) {console.error(e);});

     } catch (e) { console.error(e); }
  
   }

 );

