import { GetStaticPropsResult } from 'next';

import Pricing from '@/components/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import { Product } from 'types';

interface Props {
  products: Product[];
}

export default function Index({ products }: Props) {
  return <section className="bg-black">
      <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
                  </div>
        <p className="text-6xl font-extrabold text-white sm:text-center sm:text-6xl">
          Know yourself with your Name, Date of birth and place. Know your <span className="text-pink-500 underline">Kundali</span>
        </p>
      </div>
    </section>
  // return <Pricing products={products} />;
}

// export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
//   const products = await getActiveProductsWithPrices();

//   return {
//     props: {
//       products
//     },
//     revalidate: 60
//   };
// }
