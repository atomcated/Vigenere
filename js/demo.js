function $ (id) {
    return document.getElementById(id);
}

function charOffset (char, offset) {
    if (offset < 0)
        offset += 26;
    if(/[a-z]/.test(char)) {
        return String.fromCharCode((char.charCodeAt(0)-97+offset)%26+97);
    }else {
        return String.fromCharCode((char.charCodeAt(0)-65+offset)%26+65);
    }
}

function Vigenere (strIn, key, encode) {
    var strOut = "";
    var j=0;   //  j 对应密钥key；
    for (var i = 0; i < strIn.length; i++) {
        var c = strIn[i];
        if( /[a-zA-Z]/.test(c) ){
            var offset = key.charCodeAt( j%key.length ) - 97;
            j++;
            if(encode == false)offset = -offset;
            strOut += charOffset(c, offset);
        }else {
            strOut += c;
        }
    }
    return strOut;
}
function enVigenere (argument) {
    // body...
    console.log("加密")
    var plaintext = $("plaintext").value;
    var key = $("key").value.toLowerCase(); //key仅为字母  这里没做判断
    if(!key){alert("请输入密钥"); return;}
    $("ciphertext").value = Vigenere(plaintext, key, true);
}

function deVigenere (argument) {
    // body...
    console.log("解密")
    var ciphertext = $("ciphertext").value;
    var key = $("key").value.toLowerCase(); //key仅为字母  这里没做判断
    if(!key){alert("请输入密钥"); return;}
    $("plaintext").value = Vigenere(ciphertext, key, false);
}

function deVigenereAuto (arguments) {
    console.log("autokey");
    var ciphertext = $("ciphertext").value;
    var best_len = parseInt($("keyLen").value);
    var best_key = "";
    var count = [];
    var cipherMin = ciphertext.toLowerCase().replace(/[^a-z]/g, "");
    var freq = [8.167,1.492,2.782,4.253,12.702,2.228,2.015,6.094,6.966,0.153,0.772,4.025,2.406,6.749,7.507,1.929,0.095,5.987,6.327,9.056,2.758,0.978,2.360,0.150,1.974,0.074];
    if(!best_len) {
        for(var best_len = 3; best_len < 13; best_len++) {  //猜测key长度3————12
            var sum = 0;
            for (var j = 0; j < best_len; j++) {
                for (var i=0; i<26; i++) {
                    count[i] = 0;
                }
                for (var i = j; i < cipherMin.length; i+=best_len) {
                    count[cipherMin[i].charCodeAt(0)-97] += 1;
                }
                var ic = 0;
                var num = cipherMin.length/best_len;
                for (var i = 0; i < count.length; i++) {
                    ic += Math.pow(count[i]/num,2);
                }
                sum += ic;
                // console.log(keyLen,ic);
            }console.log(sum/best_len);
            if(sum/best_len > 0.065)break;  //确定密钥长度
        }
    }
    console.log(best_len)
    for (var j = 0; j < best_len; j++) {
        for (var i=0; i<26; i++) {
            count[i] = 0;
        }
        for (var i = j; i < cipherMin.length; i+=best_len) {
            count[cipherMin[i].charCodeAt(0)-97] += 1;
        }
        var max_dp = -1000000;
        var best_i = 0;

        for (var i = 0; i < 26; i++) {
            var cur_dp=0.0;
            for (var k = 0; k < 26; k++) {
                cur_dp += freq[k]*count[(k+i)%26];//这里要找出频率分布匹配的key
            }
            if (cur_dp > max_dp) {
                max_dp = cur_dp;
                best_i = i;
            }
        }
        best_key += String.fromCharCode(best_i+97);
    }console.log(best_key)
    $("best_key").innerHTML = "最可能的密钥："+ best_key;
    $("plaintext").value = Vigenere(ciphertext, best_key, false);
}

window.onload = function  (argument) {
    $("encryption").onclick = enVigenere;
    $("decryption1").onclick = deVigenere;
    $("decryption2").onclick = deVigenereAuto;
}
