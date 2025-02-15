import {Entity} from "../entity-decorator";
import {PrimaryKey} from "../primaryKey-decorator";
import {Column} from "../column-decorator";

@Entity("TESTING")
export class TEST_ENTITY{
    @PrimaryKey("number")
    id: number
    @Column("string")
    name: string;
    @Column("string")
    name2: string;
}