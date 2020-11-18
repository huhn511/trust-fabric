
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000
let agent;

const identity = require('iota-identity-wasm-test/node')

const IOTA_CLIENT_CONFIG = {
    network: "main",
    node: "https://nodes.thetangle.org:443",
}

app.get('/', (req, res) => {
    res.send(agent.doc)
})

app.post('/register_sensor', (req, res) => {
    console.log('Got body:', req.body);
    let sensor_did = req.body.did
    let response;
    if (sensor_did) {
        // Prepare a credential subject indicating the degree earned by Alice
        let credentialSubject = {
            id: sensor_did,
            name: "Trusted Sensor Crendential",
            degree: {
                name: "Example Sensor with Trusted Data",
                type: "TrustedSensor",
            }
        }

        // Create Objects
        let doc = identity.Doc.fromJSON(agent.doc)
        let keypair = identity.Key.fromJSON(agent.key)

        // Issue a signed `UniversityDegree` credential to Alice
        response = new identity.VerifiableCredential(doc, keypair, credentialSubject, "TrustedSource", "http://trusted.com/credentials/1337");

        console.log("Verifiable Credential: ", response)
    } else {
        response = {
            error: "No DID given in the body"
        }
    }

    res.send(response)
})

const main = async function () {

    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')

    const adapter = new FileSync('db.json')
    const db = low(adapter)
    // Set some defaults (required if your JSON file is empty)
    db.defaults({ agent: {} })
        .write()

    agent = db.get('agent')
        .value()
    // check agent
    if (Object.keys(agent).length === 0 && agent.constructor === Object) {
        console.log("agent not found...")
        console.log("creating new agent")

        const key = identity.Key.generateEd25519(IOTA_CLIENT_CONFIG.network)

        const did = new identity.DID(key, IOTA_CLIENT_CONFIG.network)
        const doc = new identity.Doc(identity.PubKey.generateEd25519(did, key.public))

        // Sign all DID documents
        doc.sign(key)

        console.log("Signed Doc: ", doc.verify())

        console.log("Publishing to the tangle...")
        let tx_hash = await identity.publish(doc.toJSON(), IOTA_CLIENT_CONFIG)

        console.log("Publish Result: https://explorer.iota.org/mainnet/transaction/" + tx_hash)

        agent = {
            key,
            did,
            doc,
            tx_hash
        }
        // Set a user using Lodash shorthand syntax
        db.set('agent', agent)
            .write()
        console.log("agent created!")
    } else {
        console.log("agent found")
        // create agent
        console.log("agent: ", agent)
    }

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })

}

main()