const icpService2 = require('../services/icpService');


const AIController = {
// Run a named model (placeholder). In a real deployment this would route to an on-chain canister or an off-chain model orchestrator.
async runModel(req, res) {
try {
const { modelName, inputs } = req.body;
if (!modelName) return res.status(400).json({ error: 'modelName required' });
// Basic permission checks could go here.
const result = await icpService2.invokeModel(modelName, inputs || {});
return res.json({ result });
} catch (err) {
return res.status(500).json({ error: 'Model invocation failed', detail: err.message });
}
}
};


module.exports = AIController;