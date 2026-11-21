'use client';
import useGet from '@/lib/useGet';
import { Grid, Tile, State } from '@/components/ui';
export default function Brands() {
  const { data, err } = useGet('/brands?limit=60');
  return (<><h2>Brands</h2><State d={data} e={err} />{data && <Grid>{data.data.map((x) => <Tile key={x._id} href={'/brands/' + x._id} item={x} />)}</Grid>}</>);
}
