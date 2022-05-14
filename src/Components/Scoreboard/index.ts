import { withScoreboardStyle } from "./Interfaces/BaseScoreboard/BaseScoreboard";
import type { BaseScoreboardProps, BaseScoreboardState, BaseScoreboardPropsHOC } from './Interfaces/BaseScoreboard/BaseScoreboard';
import { Scoreboard } from "./Scoreboard";

import { ScoreboardStyle1 } from "./ScoreboardStyles/ScoreboardStyle1/ScoreboardStyle1";
import { ScoreboardStyle2 } from "./ScoreboardStyles/ScoreboardStyle2/ScoreboardStyle2"; 

export { Scoreboard, withScoreboardStyle, ScoreboardStyle1, ScoreboardStyle2 };
export type { BaseScoreboardProps, BaseScoreboardState, BaseScoreboardPropsHOC };