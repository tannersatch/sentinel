const pem = require('pem');
const fs = require('fs');

pem.createCertificate({days:90, selfSigned:true, commonName:process.env.URL}, function(err, keys){
	if(err) return console.log('Creating certificate error', err)
	fs.writeFileSync('ssl/private.key', keys.serviceKey, 'utf8');
	fs.writeFileSync('ssl/certificate.cert', keys.certificate, 'utf8');
})
