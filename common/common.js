const logger = require('../services/logger');

module.exports.Error = (message, data) => {
    let logString = message;
    let obj = {
        status: false,
        message: message
    };

    if (data != undefined) {
        obj.data = data;
        logString += ` | ${JSON.stringify(data)}`
    }
    logger.error(logString);
    return obj;
}

module.exports.Success = (message, data) => {
    let logString = message;
    let obj = {
        status: true,
        message: message
    };

    if (data != undefined) {
        obj.data = data;
        logString += ` | ${JSON.stringify(data)}`
    }
    logger.info(logString);
    return obj;
}

module.exports.in_array = (array, needle) => {
    for (let element of array) {
        if (element == needle){
            return true;
        }
    }
    return false;
}

module.exports.GetMD5Hash = (input) => {
    var MD5 = function (s) {
        function L(k, d) {
            return (k << d) | (k >>> (32 - d))
        }

        function K(G, k) {
            var I, d, F, H, x;
            F = (G & 2147483648);
            H = (k & 2147483648);
            I = (G & 1073741824);
            d = (k & 1073741824);
            x = (G & 1073741823) + (k & 1073741823);
            if (I & d) {
                return (x ^ 2147483648 ^ F ^ H)
            }
            if (I | d) {
                if (x & 1073741824) {
                    return (x ^ 3221225472 ^ F ^ H)
                } else {
                    return (x ^ 1073741824 ^ F ^ H)
                }
            } else {
                return (x ^ F ^ H)
            }
        }

        function r(d, F, k) {
            return (d & F) | ((~d) & k)
        }

        function q(d, F, k) {
            return (d & k) | (F & (~k))
        }

        function p(d, F, k) {
            return (d ^ F ^ k)
        }

        function n(d, F, k) {
            return (F ^ (d | (~k)))
        }

        function u(G, F, aa, Z, k, H, I) {
            G = K(G, K(K(r(F, aa, Z), k), I));
            return K(L(G, H), F)
        }

        function f(G, F, aa, Z, k, H, I) {
            G = K(G, K(K(q(F, aa, Z), k), I));
            return K(L(G, H), F)
        }

        function D(G, F, aa, Z, k, H, I) {
            G = K(G, K(K(p(F, aa, Z), k), I));
            return K(L(G, H), F)
        }

        function t(G, F, aa, Z, k, H, I) {
            G = K(G, K(K(n(F, aa, Z), k), I));
            return K(L(G, H), F)
        }

        function e(G) {
            var Z;
            var F = G.length;
            var x = F + 8;
            var k = (x - (x % 64)) / 64;
            var I = (k + 1) * 16;
            var aa = Array(I - 1);
            var d = 0;
            var H = 0;
            while (H < F) {
                Z = (H - (H % 4)) / 4;
                d = (H % 4) * 8;
                aa[Z] = (aa[Z] | (G.charCodeAt(H) << d));
                H++
            }
            Z = (H - (H % 4)) / 4;
            d = (H % 4) * 8;
            aa[Z] = aa[Z] | (128 << d);
            aa[I - 2] = F << 3;
            aa[I - 1] = F >>> 29;
            return aa
        }

        function B(x) {
            var k = "", F = "", G, d;
            for (d = 0; d <= 3; d++) {
                G = (x >>> (d * 8)) & 255;
                F = "0" + G.toString(16);
                k = k + F.substr(F.length - 2, 2)
            }
            return k
        }

        function J(k) {
            k = k.replace(/rn/g, "n");
            var d = "";
            for (var F = 0; F < k.length; F++) {
                var x = k.charCodeAt(F);
                if (x < 128) {
                    d += String.fromCharCode(x)
                } else {
                    if ((x > 127) && (x < 2048)) {
                        d += String.fromCharCode((x >> 6) | 192);
                        d += String.fromCharCode((x & 63) | 128)
                    } else {
                        d += String.fromCharCode((x >> 12) | 224);
                        d += String.fromCharCode(((x >> 6) & 63) | 128);
                        d += String.fromCharCode((x & 63) | 128)
                    }
                }
            }
            return d
        }

        var C = Array();
        var P, h, E, v, g, Y, X, W, V;
        var S = 7, Q = 12, N = 17, M = 22;
        var A = 5, z = 9, y = 14, w = 20;
        var o = 4, m = 11, l = 16, j = 23;
        var U = 6, T = 10, R = 15, O = 21;
        s = J(s);
        C = e(s);
        Y = 1732584193;
        X = 4023233417;
        W = 2562383102;
        V = 271733878;
        for (P = 0; P < C.length; P += 16) {
            h = Y;
            E = X;
            v = W;
            g = V;
            Y = u(Y, X, W, V, C[P + 0], S, 3614090360);
            V = u(V, Y, X, W, C[P + 1], Q, 3905402710);
            W = u(W, V, Y, X, C[P + 2], N, 606105819);
            X = u(X, W, V, Y, C[P + 3], M, 3250441966);
            Y = u(Y, X, W, V, C[P + 4], S, 4118548399);
            V = u(V, Y, X, W, C[P + 5], Q, 1200080426);
            W = u(W, V, Y, X, C[P + 6], N, 2821735955);
            X = u(X, W, V, Y, C[P + 7], M, 4249261313);
            Y = u(Y, X, W, V, C[P + 8], S, 1770035416);
            V = u(V, Y, X, W, C[P + 9], Q, 2336552879);
            W = u(W, V, Y, X, C[P + 10], N, 4294925233);
            X = u(X, W, V, Y, C[P + 11], M, 2304563134);
            Y = u(Y, X, W, V, C[P + 12], S, 1804603682);
            V = u(V, Y, X, W, C[P + 13], Q, 4254626195);
            W = u(W, V, Y, X, C[P + 14], N, 2792965006);
            X = u(X, W, V, Y, C[P + 15], M, 1236535329);
            Y = f(Y, X, W, V, C[P + 1], A, 4129170786);
            V = f(V, Y, X, W, C[P + 6], z, 3225465664);
            W = f(W, V, Y, X, C[P + 11], y, 643717713);
            X = f(X, W, V, Y, C[P + 0], w, 3921069994);
            Y = f(Y, X, W, V, C[P + 5], A, 3593408605);
            V = f(V, Y, X, W, C[P + 10], z, 38016083);
            W = f(W, V, Y, X, C[P + 15], y, 3634488961);
            X = f(X, W, V, Y, C[P + 4], w, 3889429448);
            Y = f(Y, X, W, V, C[P + 9], A, 568446438);
            V = f(V, Y, X, W, C[P + 14], z, 3275163606);
            W = f(W, V, Y, X, C[P + 3], y, 4107603335);
            X = f(X, W, V, Y, C[P + 8], w, 1163531501);
            Y = f(Y, X, W, V, C[P + 13], A, 2850285829);
            V = f(V, Y, X, W, C[P + 2], z, 4243563512);
            W = f(W, V, Y, X, C[P + 7], y, 1735328473);
            X = f(X, W, V, Y, C[P + 12], w, 2368359562);
            Y = D(Y, X, W, V, C[P + 5], o, 4294588738);
            V = D(V, Y, X, W, C[P + 8], m, 2272392833);
            W = D(W, V, Y, X, C[P + 11], l, 1839030562);
            X = D(X, W, V, Y, C[P + 14], j, 4259657740);
            Y = D(Y, X, W, V, C[P + 1], o, 2763975236);
            V = D(V, Y, X, W, C[P + 4], m, 1272893353);
            W = D(W, V, Y, X, C[P + 7], l, 4139469664);
            X = D(X, W, V, Y, C[P + 10], j, 3200236656);
            Y = D(Y, X, W, V, C[P + 13], o, 681279174);
            V = D(V, Y, X, W, C[P + 0], m, 3936430074);
            W = D(W, V, Y, X, C[P + 3], l, 3572445317);
            X = D(X, W, V, Y, C[P + 6], j, 76029189);
            Y = D(Y, X, W, V, C[P + 9], o, 3654602809);
            V = D(V, Y, X, W, C[P + 12], m, 3873151461);
            W = D(W, V, Y, X, C[P + 15], l, 530742520);
            X = D(X, W, V, Y, C[P + 2], j, 3299628645);
            Y = t(Y, X, W, V, C[P + 0], U, 4096336452);
            V = t(V, Y, X, W, C[P + 7], T, 1126891415);
            W = t(W, V, Y, X, C[P + 14], R, 2878612391);
            X = t(X, W, V, Y, C[P + 5], O, 4237533241);
            Y = t(Y, X, W, V, C[P + 12], U, 1700485571);
            V = t(V, Y, X, W, C[P + 3], T, 2399980690);
            W = t(W, V, Y, X, C[P + 10], R, 4293915773);
            X = t(X, W, V, Y, C[P + 1], O, 2240044497);
            Y = t(Y, X, W, V, C[P + 8], U, 1873313359);
            V = t(V, Y, X, W, C[P + 15], T, 4264355552);
            W = t(W, V, Y, X, C[P + 6], R, 2734768916);
            X = t(X, W, V, Y, C[P + 13], O, 1309151649);
            Y = t(Y, X, W, V, C[P + 4], U, 4149444226);
            V = t(V, Y, X, W, C[P + 11], T, 3174756917);
            W = t(W, V, Y, X, C[P + 2], R, 718787259);
            X = t(X, W, V, Y, C[P + 9], O, 3951481745);
            Y = K(Y, h);
            X = K(X, E);
            W = K(W, v);
            V = K(V, g)
        }
        var i = B(Y) + B(X) + B(W) + B(V);
        return i.toLowerCase()
    };
    var output = (MD5(input));
    return output;
}

module.exports.GetDefaultAvatar = () => {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAFmpJREFUeJzt3X10XHWdx/HP9zeTkKTUolC1BXlscSm0hSQtVYSiQpuUQkEbVJqmImzXPa6y5+zB9ZnFg667Phxd3WVlV6BP8hCen5oW9RgBLW1SISxVNFiUSlkQrNI2ycy93+/+QVkKtulMMpnvvTOf1z9A20Pfydzfd373zuQOQEREREREREREREREREREREREREREREREREREREREREREREREREREREREZSXeATR2prW11Y7fPe6ofKzHZMSOMshEwA5TyASB1sKkFgAgljOEXDDsgOAFgT0fm/y2JhO2Rs/WPtXbe03e+UuhMcIBUCHmzp2bfanuiBkSMu8E9FRRmalBTghAdnT/Z80D+IUBfQJsEMk8dPS43Y91dnbGJQknVxwAKTbj7PY312RwrkFag+AsQCaU5S9W3YEQ7gew1jL5u3vvueEPZfl7qeQ4AFJm2ty2gxvq6y5UkQ8F1fcghODZo4o4BP2hKG4YUnT23b96l2cPFYcDICVmtyyZpiKfUMVFIYTx3j37osCfA2yNxeHfetev+KV3Dx0YB0DCNc5fcjognw4htHq3FMfuhdiXe+5b/VPvEto/DoCEaprXMVsCroLgbO+W0TCzLsuEz22+d0Wvdwv9JQ6AhJlzTsfhedWvCEK7d0spGXC9afyZzevWbPduoVdxACREW1tbZuvO+r8D8CUA47x7xshOQD/VM/u4q3HlleodQxwAiTCrdenxBqwAZI53S1moPqQSlm3uWvmkd0q1c30JiSCzWpf+tan9vGoWPwCEcFoQPNLYsnQZ+CTkit98J00LlzcgHrhGIEu8WzyZ2XU1Bw98bMMttwx4t1QjDgAHpyy46KiMhbuAMMO7JSE2B4sXbexas807pNrwFKDMZrUubZY4bODif43G2GTD7HntM71Dqg13AGU0q2XZe83iuxBCg3dLQu2E2cKerlXd3iHVgjuAMmmcv+wck/heLv5hHaxiXbMWLGvxDqkW3AGUQXNrRyugdwKhxrslFRQ5wM7pWbfqB94plY4DYIw1zV92poV4bUCo825JFdXdJjK/t2vVg94plYwDYAw1n9N+kmp4KABv8G5JJcUfgfgdPevW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";
}