export interface Header {
  magic: string;
  version: number;
  size: number;
}

export interface Game {
  state: number;
  gameplayVariant: string;
  mapId: string;
  mapName: string;
}

export interface Race {
  state: number;
  time: number;
  respawnCount: number;
  checkpointCount: number;
  checkpointTimes: number[];
  checkpointsPerLap: number;
  lapsPerRace: number;
  timestamp: number;
  startTimestamp: number;
}

export interface Quaternion {
  w: number;
  x: number;
  y: number;
  z: number;
}

export interface Vector {
  x: number;
  y: number;
  z: number;
}

export interface Object {
  timestamp: number;
  discontinuityCount: number;
  rotation: Quaternion;
  translation: Vector;
  velocity: Vector;
  latestStableGroundContactTime: number;
}

export interface Vehicle {
  timestamp: number;
  inputSteer: number;
  inputGasPedal: number;
  inputIsBraking: boolean;
  inputIsHorn: boolean;
  engineRpm: number;
  engineCurGear: number;
  engineTurboRatio: number;
  engineFreeWheeling: boolean;
  wheelsIsGroundContact: boolean[];
  wheelsIsSliping: boolean[];
  wheelsDamperLen: number[];
  wheelsDamperRangeMin: number;
  wheelsDamperRangeMax: number;
  rumbleIntensity: number;
  speedMeter: number;
  isInWater: boolean;
  isSparkling: boolean;
  isLightTrails: boolean;
  isLightsOn: boolean;
  isFlying: boolean;
  isOnIce: boolean;
  handicap: number;
  boostRatio: number;
}

export interface Device {
  euler: Vector;
  centeredYaw: number;
  centeredAltitude: number;
}

export interface Player {
  isLocalPlayer: boolean;
  trigram: string;
  dossardNumber: string;
  hue: number;
  userName: string;
}

export interface Telemetry {
  updateNumber: number;
  header: Header;
  game: Game;
  race: Race;
  object: Object;
  vehicle: Vehicle;
  device: Device;
  player: Player;
}

export function read(): Telemetry;
