import {applyDecorators} from '@nestjs/common';
import {Prop} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsInstance} from 'class-validator';
import {Types} from 'mongoose';

function objectId(value): Types.ObjectId | undefined {
    try {
        return new Types.ObjectId(value);
    } catch (e) {
        return undefined;
    }
}

export function Ref(ref: string) {
    return applyDecorators(
        Prop({type: Types.ObjectId, ref}),
        ApiProperty({example: '62fc9b33773277d12d28929b', format: 'objectid'}),
        Transform(({value}) => objectId(value)),
        IsInstance(Types.ObjectId),
    );
}

export function RefArray(ref: string) {
    return applyDecorators(
        Prop({type: [{type: Types.ObjectId, ref}]}),
        ApiProperty({isArray: true, example: ['62fc9b33773277d12d28929b'], format: 'objectid'}),
        Transform(({value}) => Array.isArray(value) && value.map(objectId)),
        IsInstance(Types.ObjectId, {each: true}),
    );
}
