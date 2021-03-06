import { Injectable } from '@angular/core';
import {
    DEFAULT_BOOLEAN_DESERIALIZER,
    DEFAULT_BOOLEAN_SERIALIZER,
    DEFAULT_NUMBER_DESERIALIZER,
    DEFAULT_NUMBER_SERIALIZER,
    DEFAULT_STRING_DESERIALIZER,
    DEFAULT_STRING_SERIALIZER
} from './serializers';
import { LOOSE_IDENTITY_COMPARATOR } from './util';
import { RouterOptions } from './router-adapter/router-adapter.interface';
import { MultiQueryParam, QueryParam, PartitionedQueryParam } from './model/query-param';
import { QueryParamGroup } from './model/query-param-group';
import {
    MultiQueryParamOpts,
    PartitionedQueryParamOpts,
    QueryParamGroupOpts,
    QueryParamOpts
} from './model/query-param-opts';

function isMultiOpts<T>(opts: QueryParamOpts<T> | MultiQueryParamOpts<T>): opts is MultiQueryParamOpts<T> {
    return opts.multi === true;
}

/**
 * Service to create parameters and groups.
 *
 * This service provides a simple API to create {@link QueryParamGroup} and {@link QueryParam}
 * instances and is the recommended way to set them up.
 */
@Injectable({
    providedIn: 'root'
})
export class QueryParamBuilder {

    /**
     * Creates a new {@link QueryParamGroup}.
     *
     * This is the primary method to create a new group of parameters. Pass a list of
     * {@link QueryParam} instances by using the `xxxParam` methods.
     *
     * @param queryParams List of {@link QueryParam}s keyed by a unique name.
     * @param extras Additional parameters for this group, overriding global configuration.
     * @returns The new {@link QueryParamGroup}.
     */
    public group(
        queryParams: { [ name: string ]: QueryParam<any> | MultiQueryParam<any> | PartitionedQueryParam<any> },
        extras: RouterOptions & QueryParamGroupOpts = {}
    ): QueryParamGroup {
        // TODO Maybe we should first validate that no two queryParams defined the same "param".
        return new QueryParamGroup(queryParams, extras);
    }

    /** @ignore */
    public partition<T, G1>(
        queryParams: [QueryParam<G1> | MultiQueryParam<G1>],
        opts: PartitionedQueryParamOpts<T, [G1]>
    ): PartitionedQueryParam<T, [G1]>;
    /** @ignore */
    public partition<T, G1, G2>(
        queryParams: [QueryParam<G1> | MultiQueryParam<G1>, QueryParam<G2> | MultiQueryParam<G2>],
        opts: PartitionedQueryParamOpts<T, [G1, G2]>
    ): PartitionedQueryParam<T, [G1, G2]>;
    /** @ignore */
    public partition<T, G1, G2, G3>(
        queryParams: [QueryParam<G1> | MultiQueryParam<G1>, QueryParam<G2> | MultiQueryParam<G2>, QueryParam<G3> | MultiQueryParam<G3>],
        opts: PartitionedQueryParamOpts<T, [G1, G2, G3]>
    ): PartitionedQueryParam<T, [G1, G2, G3]>;
    /**
     * Partition a query parameter into multiple others.
     *
     * Partitioning is useful if you need to bind a single form control to multiple query parameters.
     * For example, consider a {@code <select>} which represents both a field to sort by and the
     * direction to sort in. If you want to encode these two information on separate URL parameters,
     * you can define a single query parameter that is partitioned into two others.
     *
     * @param queryParams The query parameters making up this partition.
     * @param opts See {@link PartitionedQueryParamOpts}.
     */
    public partition<T, G extends unknown[]>(
        queryParams: (QueryParam<G[number]> | MultiQueryParam<G[number]>)[],
        opts: PartitionedQueryParamOpts<T, G>
    ): PartitionedQueryParam<T, G> {
        return new PartitionedQueryParam(queryParams, opts);
    }

    /** @ignore */
    public stringParam(urlParam: string, opts: MultiQueryParamOpts<string>): MultiQueryParam<string>;
    /** @ignore */
    public stringParam(urlParam: string, opts?: QueryParamOpts<string>): QueryParam<string>;
    /**
     * Create a new parameter of type `string`.
     *
     * See {@link QueryParamOpts}.
     */
    public stringParam(
        urlParam: string,
        opts: QueryParamOpts<string> | MultiQueryParamOpts<string> = {}
    ): QueryParam<string> | MultiQueryParam<string> {
        opts = {
            serialize: DEFAULT_STRING_SERIALIZER,
            deserialize: DEFAULT_STRING_DESERIALIZER,
            compareWith: LOOSE_IDENTITY_COMPARATOR,
            ...opts,
        };

        if (isMultiOpts(opts)) {
            return new MultiQueryParam<string>(urlParam, opts);
        } else {
            return new QueryParam<string>(urlParam, opts);
        }
    }

    /** @ignore */
    public numberParam(urlParam: string, opts: MultiQueryParamOpts<number>): MultiQueryParam<number>;
    /** @ignore */
    public numberParam(urlParam: string, opts?: QueryParamOpts<number>): QueryParam<number>;
    /**
     * Create a new parameter of type `number`.
     *
     * See {@link QueryParamOpts}.
     */
    public numberParam(
        urlParam: string,
        opts: QueryParamOpts<number> | MultiQueryParamOpts<number> = {}
    ): QueryParam<number> | MultiQueryParam<number> {
        opts = {
            serialize: DEFAULT_NUMBER_SERIALIZER,
            deserialize: DEFAULT_NUMBER_DESERIALIZER,
            compareWith: LOOSE_IDENTITY_COMPARATOR,
            ...opts,
        };

        if (isMultiOpts(opts)) {
            return new MultiQueryParam<number>(urlParam, opts);
        } else {
            return new QueryParam<number>(urlParam, opts);
        }
    }

    /** @ignore */
    public booleanParam(urlParam: string, opts: MultiQueryParamOpts<boolean>): MultiQueryParam<boolean>;
    /** @ignore */
    public booleanParam(urlParam: string, opts?: QueryParamOpts<boolean>): QueryParam<boolean>;
    /**
     * Create a new parameter of type `boolean`.
     *
     * See {@link QueryParamOpts}.
     */
    public booleanParam(
        urlParam: string,
        opts: QueryParamOpts<boolean> | MultiQueryParamOpts<boolean> = {}
    ): QueryParam<boolean> | MultiQueryParam<boolean> {
        opts = {
            serialize: DEFAULT_BOOLEAN_SERIALIZER,
            deserialize: DEFAULT_BOOLEAN_DESERIALIZER,
            compareWith: LOOSE_IDENTITY_COMPARATOR,
            ...opts,
        };

        if (isMultiOpts(opts)) {
            return new MultiQueryParam<boolean>(urlParam, opts);
        } else {
            return new QueryParam<boolean>(urlParam, opts);
        }
    }

    /** @ignore */
    public param<T>(urlParam: string, opts: MultiQueryParamOpts<T>): MultiQueryParam<T>;
    /** @ignore */
    public param<T>(urlParam: string, opts?: QueryParamOpts<T>): QueryParam<T>;
    /**
     * Create a new parameter for a complex type.
     *
     * See {@link QueryParamOpts}.
     */
    public param<T>(
        urlParam: string,
        opts: QueryParamOpts<T> | MultiQueryParamOpts<T> = {}
    ): QueryParam<T> | MultiQueryParam<T> {
        opts = {
            compareWith: LOOSE_IDENTITY_COMPARATOR,
            ...opts,
        };

        if (isMultiOpts(opts)) {
            return new MultiQueryParam<T>(urlParam, opts);
        } else {
            return new QueryParam<T>(urlParam, opts);
        }
    }

}
