'use client';
import useGet from '@/lib/useGet';
import { Grid, Tile, State } from '@/components/ui';
export default function Categories() {
  const { data, err } = useGet('/categories');
  return (<><h2>Categories</h2><State d={data} e={err} />{data && <Grid>{data.data.map((x) => <Tile key={x._id} href={'/categories/' + x._id} item={x} />)}</Grid>}</>);
}
