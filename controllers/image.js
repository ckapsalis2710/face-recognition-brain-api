const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");


const handleApiCall = (req, res) => {
	// clarifai API credentials
	const PAT = '28a810cf2ffd4743b6d64c776f63792a';
	const USER_ID = 'wuzamanfou';
	const APP_ID = 'test';
	const MODEL_ID = 'face-detection';
	const IMAGE_URL = req.body.input;

	const stub = ClarifaiStub.grpc();

	// This will be used by every Clarifai endpoint call
	const metadata = new grpc.Metadata();
	metadata.set("authorization", "Key " + PAT);

	stub.PostModelOutputs(
	    {
	        user_app_id: {
	            "user_id": USER_ID,
	            "app_id": APP_ID
	        },
	        model_id: MODEL_ID,
	        inputs: [
	            { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
	        ]
	    },
	    metadata,
	    (err, response) => {
	        if (err) {
	            // throw new Error(err);
	            return res.status(400).json('there was an error from Clarifai API');
	        }

	        if (response.status.code !== 10000) {
	            // throw new Error("Post model outputs failed, status: " + response.status.description);
	            return res.status(400).json('Clarifai API: Post model outputs failed');
	        }

	        // Since we have one input, one output will exist here
	        const output = response.outputs[0];

	        // console.log("Predicted concepts:");
	        for (const concept of output.data.concepts) {
	            console.log(concept.name + " " + concept.value);
	        }
	        return res.json(response);
	    }
	);
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries);
	})
	.catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
	handleImage,
	handleApiCall
};