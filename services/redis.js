const config = require('config');
const Promise = require("bluebird");
const redis = Promise.promisifyAll(require('ioredis'));

module.exports = class RedisConnection {

    constructor() {
        this.redisip = config.Redis.ip;
        this.redisport = config.Redis.port;
        this.redispass = config.Redis.password;
        this.redismode = config.Redis.mode;
        this.redisdb = config.Redis.db;

        this.redisSetting = {
            port: this.redisport,
            host: this.redisip,
            family: 4,
            password: this.redispass,
            db: this.redisdb,
            retryStrategy: function (times) {
                var delay = Math.min(times * 50, 2000);
                return delay;
            },
            reconnectOnError: function (err) {

                return true;
            }
        };

        if (this.redismode == 'sentinel') {
            if (config.Redis.sentinels && config.Redis.sentinels.hosts && config.Redis.sentinels.port && config.Redis.sentinels.name) {
                var sentinelHosts = config.Redis.sentinels.hosts.split(',');
                if (Array.isArray(sentinelHosts) && sentinelHosts.length > 2) {
                    var sentinelConnections = [];

                    sentinelHosts.forEach(function (item) {

                        sentinelConnections.push({host: item, port: config.Redis.sentinels.port})

                    })
                    this.redisSetting = {
                        sentinels: sentinelConnections,
                        name: config.Redis.sentinels.name,
                        password: this.redispass
                    }
                } else {
                    console.log("No enough sentinel servers found .........");
                }
            }
        }

        this.redisClient = undefined;

        if (this.redismode != "cluster") {
            this.redisClient = new redis(this.redisSetting);
        } else {
            var redisHosts = this.redisip.split(",");
            if (Array.isArray(redisHosts)) {
                this.redisSetting = [];
                redisHosts.forEach(function (item) {
                    this.redisSetting.push({
                        host: item,
                        port: this.redisport,
                        family: 4,
                        password: this.redispass
                    });
                });
                this.redisClient = new redis.Cluster([this.redisSetting]);
            } else {
                this.redisClient = new redis(this.redisSetting);
            }
        }
    }

    Client() {
        return this.redisClient;
    }

    Set(key, timeInSeconds, value) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {

            let objstr = JSON.stringify(value);
            redisClient.set(key, objstr).then(function (_value) {

                resolve(value);
                //console.log(_value);
                // const expin = moment().add({minutes: 60*24}).unix();
                redisClient.expire(key, timeInSeconds).then(function (done) {
                    resolve(value);
                }).catch(function (error) {
                    //console.log(error);
                    reject(error);
                });
            }).catch(function (error) {
                //console.log(error);
                reject(error);
            });
        });
    }

    SetRaw(key, timeInSeconds, value) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            redisClient.set(key, value).then(function (_value) {

                resolve(value);
                //console.log(_value);
                // const expin = moment().add({minutes: 60*24}).unix();
                redisClient.expire(key, timeInSeconds).then(function (done) {
                    resolve(value);
                }).catch(function (error) {
                    //console.log(error);
                    reject(error);
                });
            }).catch(function (error) {
                //console.log(error);
                reject(error);
            });
        });
    }

    SetNonExpire(key, value) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            let objstr = JSON.stringify(value);
            redisClient.set(key, objstr).then(function (_value) {
                resolve(value);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    SetRawNonExpire(key, value) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            redisClient.set(key, value).then(function (_value) {
                resolve(value);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    Get(key) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            if (!IsCacheReadEnabled && !key.includes("Campaign") && !key.includes("OTP")) {
                reject("");
            }
            redisClient.get(key).then(function (value) {
                resolve(JSON.parse(value));
            }).catch(function (error) {
                reject(error);
            });
        });

    }

    Exists(key) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            redisClient.exists(key).then(function (value) {
                resolve(value);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    Delete(key) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {

            redisClient.del(key).then(function (value) {
                if (value == 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    SetHash(key, obj, time) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            redisClient.hmset(key, obj).then(function (value) {
                resolve(value);
            }).catch(function (error) {
                reject(error);
            });
            if (time) {
                redisClient.expire(key, time).then(function (value) {
                    resolve(value);
                }).catch(function (error) {
                    reject(error);
                });
            } else {
                redisClient.expire(key, 86400).then(function (value) {
                    resolve(value);
                }).catch(function (error) {
                    reject(error);
                });
            }

        });
    }

    GetHashFeild(key, feild) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            redisClient.hget(key, feild).then(function (value) {
                resolve(value)
            }).catch(function (error) {
                reject(error)
            })
        });
    }

    GetHash(key) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            redisClient.hgetall(key).then(function (value) {
                resolve(value)
            }).catch(function (error) {
                reject(error)
            })
        });
    }

    HashExists(key, feild) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            redisClient.hexists(key, feild).then(function (value) {
                resolve(value)
            }).catch(function (error) {
                reject(error)
            })
        });
    }

    RemoveHash(key) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            redisClient.del(key).then(function (value) {
                resolve(value)
            }).catch(function (error) {
                reject(error)
            })
        });

    }

    RemoveHashFeild(key, feild) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            redisClient.hdel(key, feild).then(function (value) {
                resolve(value)
            }).catch(function (error) {
                reject(error)
            })
        });
        //
    }

    Incr(key) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            redisClient.pipeline().incr(key).exec(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
        //
    }

    Decr(key) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            redisClient.pipeline().decr(key).exec(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
        //
    }

    Keys(key) {
        var redisClient = this.redisClient;
        return new Promise(function (resolve, reject) {
            redisClient.keys(key).then(function (value) {
                resolve(value);
            }).catch(function (error) {
                reject(error);
            });
        });
    }


};










