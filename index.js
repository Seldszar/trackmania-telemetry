const binding = require('./build/Release/binding');

class Reader {
  byteOffset = 0;

  constructor(buffer) {
    this.decoder = new TextDecoder("utf-8");
    this.view = new DataView(buffer);
  }

  _wrapForward(value, byteLength) {
    this.byteOffset += byteLength;

    return value;
  }

  readBuffer(byteLength) {
    return this._wrapForward(
      this.view.buffer.slice(this.byteOffset, this.byteOffset + byteLength),
      byteLength,
    );
  }

  _readMethod(method, byteLength) {
    return this._wrapForward(
      method.call(this.view, this.byteOffset),
      byteLength,
    );
  }

  readInt() {
    return this._readMethod(DataView.prototype.getInt32, 4);
  }

  readUint() {
    return this._readMethod(DataView.prototype.getUint32, 4);
  }

  readFloat() {
    return this._readMethod(DataView.prototype.getFloat32, 4);
  }

  readBoolean() {
    return Boolean(this.readUint());
  }

  readString(length) {
    return this.decoder.decode(this.readBuffer(length));
  }
}

function times(length, callback) {
  return Array.from({ length }, callback);
}

function read() {
  const reader = new Reader(binding.read());

  return {
    header: {
      magic: reader.readString(32),
      version: reader.readUint(),
      size: reader.readUint(),
    },

    updateNumber: reader.readUint(),

    game: {
      state: reader.readUint(),
      gameplayVariant: reader.readString(64),
      mapId: reader.readString(64),
      mapName: reader.readString(256),

      __future__: reader.readBuffer(128),
    },

    race: {
      state: reader.readUint(),
      time: reader.readUint(),
      respawnCount: reader.readUint(),
      checkpointCount: reader.readUint(),
      checkpointTimes: times(125, () => reader.readUint()),
      checkpointsPerLap: reader.readUint(),
      lapsPerRace: reader.readUint(),
      timestamp: reader.readUint(),
      startTimestamp: reader.readUint(),

      __future__: reader.readBuffer(16),
    },

    object: {
      timestamp: reader.readUint(),
      discontinuityCount: reader.readUint(),

      rotation: {
        w: reader.readFloat(),
        x: reader.readFloat(),
        y: reader.readFloat(),
        z: reader.readFloat(),
      },

      translation: {
        x: reader.readFloat(),
        y: reader.readFloat(),
        z: reader.readFloat(),
      },

      velocity: {
        x: reader.readFloat(),
        y: reader.readFloat(),
        z: reader.readFloat(),
      },

      latestStableGroundContactTime: reader.readUint(),

      __future__: reader.readBuffer(32),
    },

    vehicle: {
      timestamp: reader.readUint(),
      inputSteer: reader.readFloat(),
      inputGasPedal: reader.readFloat(),
      inputIsBraking: reader.readBoolean(),
      inputIsHorn: reader.readBoolean(),
      engineRpm: reader.readFloat(),
      engineCurGear: reader.readInt(),
      engineTurboRatio: reader.readFloat(),
      engineFreeWheeling: reader.readBoolean(),
      wheelsIsGroundContact: times(4, () => reader.readBoolean()),
      wheelsIsSliping: times(4, () => reader.readBoolean()),
      wheelsDamperLen: times(4, () => reader.readFloat()),
      wheelsDamperRangeMin: reader.readFloat(),
      wheelsDamperRangeMax: reader.readFloat(),
      rumbleIntensity: reader.readFloat(),
      speedMeter: reader.readUint(),
      isInWater: reader.readBoolean(),
      isSparkling: reader.readBoolean(),
      isLightTrails: reader.readBoolean(),
      isLightsOn: reader.readBoolean(),
      isFlying: reader.readBoolean(),
      isOnIce: reader.readBoolean(),
      handicap: reader.readUint(),
      boostRatio: reader.readFloat(),

      __future__: reader.readBuffer(20),
    },

    device: {
      euler: {
        x: reader.readFloat(),
        y: reader.readFloat(),
        z: reader.readFloat(),
      },

      centeredYaw: reader.readFloat(),
      centeredAltitude: reader.readFloat(),

      __future__: reader.readBuffer(32),
    },

    player: {
      isLocalPlayer: reader.readBoolean(),
      trigram: reader.readString(4),
      dossardNumber: reader.readString(4),
      hue: reader.readFloat(),
      userName: reader.readString(256),

      __future__: reader.readBuffer(28),
    },
  };
}

read();

module.exports = { read };
