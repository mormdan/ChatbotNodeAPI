const Post = require("../models/post");
const Utility = require("../utilities/utility")
exports.getWebhook = (req, res) => {
    const VERIFY_TOKEN = process.env.VALIDATION_TOKEN;   
};


exports.getMessage = (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.VALIDATION_TOKEN) {
        console.log("=========Verified================");
        console.log(req.query['hub.verify_token']);
        res.status(200).send(req.query['hub.challenge']);
	} else {
		console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
};

exports.recieveMessage = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;
  
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
  
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Get the webhook event. entry.messaging is an array, but 
        // will only ever contain one event, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
            Utility.handleMessage(sender_psid, webhook_event.message);        
        } else if (webhook_event.postback) {
            Utility.handlePostback(sender_psid, webhook_event.postback);
        }
        
      });
  
      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');
  
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      console.log("heeeeeeeeeeeeeeeee");
      res.sendStatus(404);
    }
};

exports.getPosts = (req, res) => {
    //res.json(Posts = [{'title': 'Post 1'}, {'title': 'post 2'}]);
    //res.send("hello world")
    const post = Post.find()
    .select("title body")
    .then((posts)=>{
        res.json({posts});
    })
    .catch((err)=>{
        console.log(err)
    })
    };

exports.createPost = (req, res) => {
    const post = new Post(req.body);
    console.log("Post Created Successfully", req.body);
    // res.json(req.body);
    post.save((err, result)=>{
        if(err){
            console.log("error");
            return res.status(400).json({
                error: err 
            });
        }
        console.log("before 200");
        res.status(200).json({
            post: result
        });
        console.log("after 200");
    });

};
