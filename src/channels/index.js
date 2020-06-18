import Travel from "./Travel.svelte";
import Gluttony from "./Gluttony.svelte";
import Feelings from "./Feelings.svelte";
import Empty from "./Empty.svelte";

const channels = [Travel, Gluttony, Feelings, Empty];
shuffleArray(channels);

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export { channels };