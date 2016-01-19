
----------------------------------------------------------------------
JSBN

Version 1.4 (2013/07/01)
-> Included 2014/03/23 in project nzrb-tab-html5

http://www-cs-students.stanford.edu/~tjw/jsbn/

Fixed variable name collision between sha1.js and base64.js.
Obtain entropy from window.crypto.getRandomValues where available.
Added ECCurveFp.encodePointHex.
Fixed inconsistent use of DV in jsbn.js.

Core Library
jsbn.js - basic BigInteger implementation, just enough for RSA encryption and not much more.
jsbn2.js - the rest of the library, including most public BigInteger methods.

RSA
rsa.js - implementation of RSA encryption, does not require jsbn2.js.
rsa2.js - rest of RSA algorithm, including decryption and keygen.

ECC
ec.js - elliptic curve math, depends on both jsbn.js and jsbn2.js
sec.js - standard elliptic curve parameters

Utilities
rng.js - rudimentary entropy collector and RNG interface, requires a PRNG backend to define prng_newstate().
prng4.js - ARC4-based PRNG backend for rng.js, very small.
base64.js - Base64 encoding and decoding routines.
sha1.js - SHA-1 hash function, only needed for IBE demo.
----------------------------------------------------------------------

----------------------------------------------------------------------
NOTES - JSBN

These files from the distribution are not used and so not included in the index files:
ec.js, sec.js, sha1.js

RSA is mainly used for key exchange. Two parties use RSA to exchange a symmetric key which they subsequently use to encrypt and exchange data.
The reason for this is that symmetric encryption is much faster than asymmetric encryption.
There is a restriction on the length of the data that can be encrypted.
Using a 2048 bit key we can encrypt up to floor(2048/8)-11 bytes i.e. 245bytes of UTF-8 data or 501bytes if we use a 4096 bit key.
An Ad. Hoc chunking protocol can be used to encrypt larger amounts of data.
----------------------------------------------------------------------

----------------------------------------------------------------------
NOTES - Encryption

http://en.wikipedia.org/wiki/RSA_(cryptosystem)

pq=n

n is the modulus
Chose public exponent e and private exponent d
Release n and e as the public key
Keep p,q,d private

To exchange a msg,
Turn msg into an integer 0<msg<n using a padding scheme
Computer cipher text c such that c is congruent with m to the power e in modulus n i.e. c and m to the power e are separated by multiples of n
Recover m from c by using private key exponent d
Reverse the padding scheme to recover the original message M

NOTE
Padding ensures that a given message, once padded, will encrypt to one of a large number of different possible ciphertexts.
PKCS#1 v1.5 padding has vulnerabilities that are fixed with Optimal Asymmetric Encryption Padding (OAEP)
The PKCS#1 standard also incorporates processing schemes designed to provide additional security for RSA signatures (e.g., the Probabilistic Signature Scheme for RSA/RSA-PSS).
----------------------------------------------------------------------

----------------------------------------------------------------------
Working with Keys - JavaScript

Determine the modulus from the public key embedded in an X.509 certificate
openssl x509 -modulus -noout < publicKey_509.pem

Determine the public key from an X.509 certificate
openssl x509 -pubkey -noout -in publicKey_509.pem > publicKey_From_509.pem

// Determine the modulus and e exponent as hex values from the public key
-> The modulus is given as hex and used in that format
-> The e exponent is given as hex and used in that format
-> Ignore the leading 00 that can appear in the modulus
openssl rsa -pubin -inform PEM -text -noout < publicKey_From_509.pem


var n_modulus = 'BAC43740D27289CBF395CB3A665C2BDD26193A9607E207BC91259BC6D1D7AF85DFDFAABC95C9B0B97FD2E50CD336714A1DF3B979BE2174CC148A2137E51FCCEBBA3AE1C08A636C8073ED34EFE78D3658903C320BF95638852198D55C704709022F8EC59B8BC6DA388E02EDA7EA626D04A088DCBB92288CF4E9A8A9B78755DA685E34B305030B89DFCAE01F8FDB4C783ECFC056B98726795F17DCB4ABC0C82910B1E36F38149E97C71D5A35BBE9D33F797C8BEDE3C390B4E1F7C014AB94E64BC80AB5CB28E9920B51F5E8E2265AF21E08F3EF5E796C98509B64A06CA2848EBE1EE6A3A52FD0B66BADBD6D957EA7496992D84E12700FED3A643627D9129A10D9A3';
var e_exponent = '10001';
var rsa = new RSAKey();
rsa.setPublic(n_modulus, e_exponent);
var cipherText = rsa.encrypt(msg);

// To convert a private key from DER to PEM:
openssl rsa -in publicPrivateKeys.der -inform DER -out publicPrivateKeys.pem -outform PEM

// Determine the modulus as hex value from the private key
-> The modulus is given as hex and used in that format
openssl rsa -in publicPrivateKeys.pem -noout -modulus

// Determine the modulus from the private key ASN.1 dump (3rd line in the output)
-> The modulus is given as hex and used in that format
openssl asn1parse < publicPrivateKeys.pem

// Determine the d exponent from the private key ASN.1 dump (5th line in the output)
-> The d exponent is given as hex and used in that format
openssl asn1parse < publicPrivateKeys.pem


var d_exponent = '692BDF55706CB16E19402C0E39E0038F6849E2B4E3C183CBCB0C9B992D47C0FEA960017C6AF905BC9FDF79BE6C1E0753CE6415F919792B9554A7A8271AAE7AADEFD402967317A3DCFDEB00D96BD2185D6CF388D737543745B8F2A08B8A6A66074612A6F27D96C00202EE61382283C4924B78669C75A4C2239484B6F5B38F440A7544709E9733D3ACB5158734D6867F9FA916B9A561AB4DED38F0FF897E696EFC718C63620F6D6824191D75895689E2C06D8F2CC7054C8E51417135941C8896A4F1D360D7B152FC7E4040F64B23DE1A723567A8EB498FBE2F49D27F2A54CB671F485B692B0207BFF01FC87A13206823EFD97E7E2B1ABD7C28C13202E4A9C6B1F9';
var rsa = new RSAKey();
rsa.setPrivate(n_modulus, e_exponent, d_exponent);
var text = rsa.decrypt(b64tohex(cipherText));
----------------------------------------------------------------------

----------------------------------------------------------------------
Working with Keys - Testing JavaScript to Java
-> Where 'http://localhost:8091' hosts a Jetty server containing the Java code above, see 'test/test-encryption' folder in project root

var message = 'Hello World!';
var value = $utilEncryption.encryptRSAUsingEBetTestPublicKey(message);

$log.debug('TEST -> Message: ' + message);
$log.debug('TEST -> Encrypted value: ' + value);

var body = 'username=' + encodeURIComponent(value);

$log.debug('TEST -> Request body: ' + body);

$http({method:'POST',
        url:'http://localhost:8091',
        timeout:180,
        data:body,
        headers:{ 'content-type':'application/x-www-form-urlencoded' },
        cache:false
    })
    .success(function(data, status, headers, config) {
      $log.debug('TEST -> Success loading data: data = ' + JSON.stringify(data));
      $log.debug('TEST -> Success loading data: status = ' + JSON.stringify(status));
      $log.debug('TEST -> Success loading data: headers = ' + JSON.stringify(headers));
      $log.debug('TEST -> Success loading data: config = ' + JSON.stringify(config));
    })
    .error(function(data, status, headers, config) {
      $log.debug('TEST -> Error loading data: data = ' + JSON.stringify(data));
      $log.debug('TEST -> Error loading data: status = ' + JSON.stringify(status));
      $log.debug('TEST -> Error loading data: headers = ' + JSON.stringify(headers));
      $log.debug('TEST -> Error loading data: config = ' + JSON.stringify(config));
    })
    .then(function(response) {
      $log.debug('TEST -> Response: ' + JSON.stringify(response));
    });

----------------------------------------------------------------------

----------------------------------------------------------------------
Working with Keys - Java

// Load private key
KeyFactory keyFactory = KeyFactory.getInstance("RSA");
File privateKeyAsFile = new File("[...]/publicPrivateKeys.der");
FileInputStream privateKeyAsFileInputStream = new FileInputStream(privateKeyAsFile);
byte[] encodedPrivateKeyAsByteArray = new byte[(int) privateKeyAsFile.length()];
privateKeyAsFileInputStream.read(encodedPrivateKeyAsByteArray);
PKCS8EncodedKeySpec encodedPrivateKey = new PKCS8EncodedKeySpec(encodedPrivateKeyAsByteArray);
PrivateKey privateKey = keyFactory.generatePrivate(encodedPrivateKey);

// Load public key
KeyFactory keyFactory = KeyFactory.getInstance("RSA");
File certificateAsFile = new File("[...]/publicKey_509.der");
FileInputStream certificateAsFileInputStream = new FileInputStream(certificateAsFile);
byte[] encodedCertificateAsByteArray = new byte[(int) certificateAsFile.length()];
certificateAsFileInputStream.read(encodedCertificateAsByteArray);
CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
Certificate certificate = certificateFactory.generateCertificate(new ByteArrayInputStream(encodedCertificateAsByteArray));
publicKey publicKey = certificate.getPublicKey();

// Encrypt with public key
Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
cipher.init(Cipher.ENCRYPT_MODE, getPublicKey());
System.out.println("Encrypting: " + text);
byte[] cipherTextAsByteArray = cipher.doFinal(text.getBytes(Charset.forName("UTF-8")));

// Decrypt with public key
Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
cipher.init(Cipher.DECRYPT_MODE, getPrivateKey());
byte[] decryptedCipherTextAsByteArray = cipher.doFinal(cipherTextAsByteArray);
String text = new String(decryptedCipherTextAsByteArray, Charset.forName("UTF-8"));
System.out.println("Decrypted cipher text: " + text);
----------------------------------------------------------------------

----------------------------------------------------------------------
Useful Commands When Working with Keys/Certificates

PEM format is required for JavaScript and DER format for Java

Generate a 2048 bit key pair
Traditional format, PEM encoding, no encryption
-> openssl genrsa -out publicPrivateKeys.pem 2048

Dump the public key to a PEM in order to share with the JavaScript
-> openssl rsa -in publicPrivateKeys.pem -pubout -out publicKey.pem

Convert the key file format to traditional with DER encoding and no encryption for use with Java
->  openssl rsa -in publicPrivateKeys.pem -inform pem -out publicPrivateKeys.der -outform der

Create an X.509 certificate with the RSA key
-> openssl req -new -x509 -keyform PEM -key publicPrivateKeys.pem -outform DER -out publicKey_509.der

To convert a X.509 certificate from DER to PEM
-> openssl x509 -in publicKey_509.der -inform DER -out publicKey_509.pem -outform PEM

To convert a X.509 certificate from PEM to DER
-> openssl x509 -in publicKey_509.pem -inform PEM –out publicKey_509.der -outform DER

To convert a key from PEM to DER:
-> openssl rsa -in input.key -inform PEM -out output.key -outform DER

To convert a key from DER to PEM:
-> openssl rsa -in input.key -inform DER -out output.key -outform PEM

Determine the modulus from the public key embedded in an X.509 certificate
-> openssl x509 -modulus -noout < publicKey_509.pem
----------------------------------------------------------------------
