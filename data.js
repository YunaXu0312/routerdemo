/* Deterministic, fictional demo data. No network, credential storage, or real hardware. */
window.QRDemo = (() => {
  const now = Date.now();
  const ago = minutes => new Date(now - minutes * 60000).toISOString();
  const frameworks = ['Qiskit', 'Cirq', 'PennyLane', 'FatQat', 'Vendor SDK'];
  const examples = {
    Qiskit: `from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(3, 3)\nqc.h(0)\nqc.cx(0, 1)\nqc.cx(1, 2)\nqc.measure(range(3), range(3))`,
    Cirq: `import cirq\n\nq = cirq.LineQubit.range(3)\ncircuit = cirq.Circuit(\n    cirq.H(q[0]), cirq.CNOT(q[0], q[1]),\n    cirq.CNOT(q[1], q[2]), cirq.measure(*q)\n)`,
    PennyLane: `import pennylane as qml\n\n@qml.qnode(qml.device("default.qubit", wires=3))\ndef ghz():\n    qml.Hadamard(wires=0)\n    qml.CNOT(wires=[0, 1])\n    qml.CNOT(wires=[1, 2])\n    return qml.probs(wires=[0, 1, 2])`,
    FatQat: `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\ncreg c[3];\nh q[0];\ncx q[0],q[1];\ncx q[1],q[2];\nmeasure q -> c;`,
    'Vendor SDK': `# Vendor-neutral adapter example\ncircuit = Circuit(qubits=3)\ncircuit.h(0)\ncircuit.cx(0, 1)\ncircuit.cx(1, 2)\nresult = qroute.submit(\n    circuit, shots=1024, route="auto"\n)`
  };
  const backends = [
    {id:'ast-127',name:'Aster Q-127 Demo',vendor:'Aster Cloud Demo',symbol:'A',type:'超导真机',kind:'hardware',qubits:127,status:'online',queue:4,wait:8,region:'东京 · ap-east',price:.84,frameworks:['Qiskit','Cirq','PennyLane','FatQat'],gates:'CZ · SX · RZ',latency:11,quality:91,health:true,description:'虚构的超导量子后端示例，展示自动路由和任务队列。'},
    {id:'neb-072',name:'Nebula N-72 Demo',vendor:'Nebula Neutral Demo',symbol:'N',type:'中性原子真机',kind:'hardware',qubits:72,status:'online',queue:2,wait:5,region:'新加坡 · ap-southeast',price:.61,frameworks:['Qiskit','Cirq','FatQat'],gates:'CZ · RX · RY',latency:14,quality:94,health:true,description:'虚构的中性原子量子后端示例。数据仅用于交互演示。'},
    {id:'ops-032',name:'OpenSim Local Demo',vendor:'OpenSim Demo',symbol:'O',type:'本地模拟器',kind:'simulator',qubits:32,status:'online',queue:5,wait:9,region:'本地 · local',price:.08,frameworks:['Qiskit','Cirq','PennyLane','FatQat','Vendor SDK'],gates:'通用门集',latency:2,quality:99,health:true,description:'虚构的本地模拟器示例，适用于展示模拟任务路由。'},
    {id:'orb-pho',name:'Orbit Photon Demo',vendor:'Orbit Lab Demo',symbol:'O',type:'光量子后端',kind:'hardware',qubits:24,status:'online',queue:6,wait:12,region:'上海 · ap-east',price:.48,frameworks:['PennyLane','Vendor SDK'],gates:'光学门集',latency:18,quality:88,health:true,description:'虚构的光量子后端接入示例。'},
    {id:'lattice-48',name:'Lattice Sim-48 Demo',vendor:'Lattice Compute Demo',symbol:'L',type:'云端模拟器',kind:'simulator',qubits:48,status:'online',queue:3,wait:3,region:'首尔 · ap-east',price:.15,frameworks:['Qiskit','Cirq','PennyLane'],gates:'通用门集',latency:5,quality:98,health:true,description:'虚构的云端模拟器示例，可用于比较等待时间与模拟价格。'}
  ];
  const taskSeed = [
    ['QRT-8F2A1','success','Qiskit','ast-127','platform',1024,ago(24),.86,3],
    ['QRT-8F29C','running','Cirq','neb-072','byok',2048,ago(9),1.23,4],
    ['QRT-8F287','queued','PennyLane','ops-032','platform',512,ago(5),.12,2],
    ['QRT-8F271','failed','FatQat','orb-pho','platform',1024,ago(67),.51,3],
    ['QRT-8F24B','success','Qiskit','ops-032','byok',4096,ago(115),.33,5],
    ['QRT-8F223','cancelled','Vendor SDK','ast-127','platform',512,ago(180),.52,2],
    ['QRT-8F1FE','preparing','Cirq','lattice-48','platform',1024,ago(2),.22,3],
    ['QRT-8F1C9','success','PennyLane','neb-072','byok',2048,ago(245),1.19,4],
    ['QRT-8F180','queued','Qiskit','ast-127','platform',1024,ago(19),.78,3]
  ];
  const projects=[{id:'prj-ghz',name:'GHZ 路由验证',owner:'量子应用组',spend:38.42,budget:100,role:'项目管理员',vendors:['Aster','Nebula','OpenSim','Lattice'],members:[{name:'林项目管理员',role:'项目管理员',status:'启用'},{name:'陈量子开发者',role:'开发者',status:'启用'}]},{id:'prj-opt',name:'组合优化试验',owner:'算法平台组',spend:24.16,budget:80,role:'项目管理员',vendors:['Nebula','Orbit','Lattice'],members:[{name:'林项目管理员',role:'项目管理员',status:'启用'},{name:'周算法开发者',role:'开发者',status:'启用'}]}];
  const tasks = taskSeed.map(([id,status,framework,backendId,access,shots,time,cost,qubits], i) => ({id,status,framework,backendId,access,shots,time,cost,qubits,project:projects[i%2].name,priority:i===2?'标准':'普通',duration:status==='success'?`${8+i*3}s`:'—',strategy:i===0?'performance':i===2?'cost':'designated',reason:i===0?'性能优先：在可行后端中按模拟等待和执行时间排序。':i===2?'成本优先：按虚构单价排序，并展示等待时间取舍。':'指定后端演示记录；任务约束校验通过。',code:examples[framework],logs:['任务已提交至 QRoute 统一入口','已识别源框架与任务资源需求','已完成后端兼容性检查','系统自动匹配后端并创建演示执行记录'],counts:{'000':Math.floor(shots*.49),'111':Math.floor(shots*.49),'其他':shots-2*Math.floor(shots*.49)}}));
  return {frameworks,examples,backends,tasks,projects,connections:[{id:'con-1',name:'Aster Cloud Demo',status:'已验证',scope:'企业演示工作区',last:'今天 09:42',backend:'Aster Q-127 Demo',masked:'oq_demo_••••7K2P'},{id:'con-2',name:'Nebula Neutral Demo',status:'已验证',scope:'GHZ 路由验证',last:'昨天 16:18',backend:'Nebula N-72 Demo',masked:'nn_demo_••••4M8Q'}],examples};
})();
